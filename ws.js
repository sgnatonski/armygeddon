const WebSocket = require('ws');
var url = require('url');
var jwt = require('jsonwebtoken');
var fs = require('./storage/arango/arango_storage').battles;
var battleLogic = require('./logic/battle');

var tokenSecret = process.env.TOKEN_SECRET;

module.exports = function webSocketSetup(server, cookieParser){
    const wss = new WebSocket.Server({ 
        verifyClient: (info, done) => {
            cookieParser(info.req, {}, () => {
                jwt.verify(info.req.cookies.a_token, tokenSecret, function(err, decoded) {
                    done(!err);
                });
            });
        },
        server 
    });

    wss.on('connection', function connection(ws, req) {
        const parameters = url.parse(req.url, true);
        var user = jwt.verify(req.cookies.a_token, tokenSecret);

        ws.battle = {
            id: parameters.query.bid,
            userid: user.id
        };

        ws.on('error', err => {
            console.log("error!: " + err);
        });

        ws.on('message', function incoming(command) {
            var cmd = JSON.parse(command);

            fs.get(ws.battle.id).then(data => {
                var result = null;
                if (cmd.cmd == 'move'){
                    result = battleLogic.processMove(data, ws.battle.userid, cmd.uid, cmd.x, cmd.y);
                }
                else if (cmd.cmd == 'turn'){
                    result = battleLogic.processTurn(data, ws.battle.userid, cmd.uid, cmd.x, cmd.y);
                }
                else if (cmd.cmd == 'attack'){
                    result = battleLogic.processAttack(data, ws.battle.userid, cmd.uid, cmd.x, cmd.y);
                }
                if (result && result.success){
                    fs.store(result.battle).then(res => {
                        wss.clients.forEach(function each(client) {
                            if (client.readyState === WebSocket.OPEN && Object.keys(result.battle.armies).some(uid => client.battle.userid == uid)) {
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
                if (battle.armies['1'] || battle.armies['2']){
                    delete battle.armies['1'];
                    delete battle.armies['2'];
                }

                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && Object.keys(battle.armies).some(uid => client.battle.userid == uid)) {
                        battle.selfArmy = client.battle.userid;

                        client.send(JSON.stringify({
                            msg: 'data',
                            data: battle
                        }));
                    }
                });
            }

            if (data.armies[ws.battle.userid]){
                sendBattle(data);
            }
            else{
                var battle = battleLogic.join(data, ws.battle.userid);

                fs.store(battle).then(result => sendBattle(data));
            }            
        });
    });
}
