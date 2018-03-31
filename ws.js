const WebSocket = require('ws');
var url = require('url');
var jwt = require('jsonwebtoken');
var storage = require('./storage/arango/arango_storage');
var fs = storage.battles;
var battleScope = require('./logic/battle_scope');

var tokenSecret = process.env.TOKEN_SECRET;

module.exports = function webSocketSetup(server, cookieParser){
    const wss = new WebSocket.Server({ 
        verifyClient: (info, done) => {
            cookieParser(info.req, {}, () => {
                jwt.verify(info.req.cookies.a_token, tokenSecret, (err, decoded) => {
                    done(!err);
                });
            });
        },
        server 
    });

    wss.on('connection', (ws, req) => {
        const parameters = url.parse(req.url, true);
        var user = jwt.verify(req.cookies.a_token, tokenSecret);

        ws.battle = {
            id: parameters.query.bid,
            userid: user.id
        };

        ws.on('error', err => {
            console.log("error!: " + err);
        });

        ws.on('message', command => {            
            fs.get(ws.battle.id).then(data => {
                var cmd = JSON.parse(command);
                var result = battleScope(data, ws.battle.userid).processCommand(cmd);
                if (result && result.success){
                    fs.store(result.battle).then(res => {
                        var uids = Object.keys(result.battle.armies);
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN && uids.some(uid => client.battle.userid == uid)) {
                                client.send(JSON.stringify({
                                    msg: 'upd',
                                    data: {
                                        currUnit: result.unit, 
                                        nextUnit: result.nextUnit,
                                        targetUnit: result.targetUnit,
                                        unitQueue: result.unitQueue
                                    }
                                }));
                            }
                        });
                    });
                }
            });
        });

        fs.get(ws.battle.id).then(data => {
            function sendBattle(battle){
                var uids = Object.keys(battle.armies);
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && uids.some(uid => client.battle.userid == uid)) {
                        battle.selfArmy = client.battle.userid;

                        client.send(JSON.stringify({
                            msg: 'data',
                            data: battle
                        }));
                    }
                });
            }

            if (data){
                if (data.armies[ws.battle.userid]){
                    sendBattle(data);
                }
                else{
                    storage.armies.getBy('playerId', ws.battle.userid).then(army =>{
                        var battle = battleScope(data, ws.battle.userid).join(army);
                        fs.store(battle).then(result => sendBattle(data));
                    });
                }   
            }      
        });
    });
}
