const WebSocket = require('ws');
var url = require('url');
var jwt = require('jsonwebtoken');
var fs = require('./storage/file_storage');
var battleLogic = require('./logic/battle');

module.exports = function webSocketSetup(server, cookieParser, app){
    const wss = new WebSocket.Server({ 
        verifyClient: (info, done) => {
            cookieParser(info.req, {}, () => {
                jwt.verify(info.req.cookies.a_token, app.get('TOKEN_SECRET'), function(err, decoded) {
                    done(!err);
                });
            })
        },
        server 
    });

    wss.on('connection', function connection(ws, req) {
        const parameters = url.parse(req.url, true);
        var user = jwt.verify(req.cookies.a_token, app.get('TOKEN_SECRET'));

        ws.battle = {
            id: parameters.query.bid,
            userid: user.id
        };

        ws.on('error', err => {
            console.log("error!: " + err);
        });

        ws.on('message', function incoming(command) {
            var cmd = JSON.parse(command);

            fs.get(`battle_${ws.battle.id}`).then(data => {
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
                    fs.store(`battle_${ws.battle.id}`, result.battle).then(res => ws.send(JSON.stringify({
                        msg: 'upd',
                        data: {
                            currUnit: result.unit, 
                            nextUnit: result.nextUnit,
                            targetUnit: result.targetUnit,
                            unitQueue: result.unitQueue
                        }
                    })));
                }
            });
        });

        fs.get(`battle_${ws.battle.id}`).then(data => {
            function sendBattle(battle){
                if (battle.armies['1'] || battle.armies['2']){
                    delete battle.armies['1'];
                    delete battle.armies['2'];
                }
                ws.send(JSON.stringify({
                    msg: 'data',
                    data: data
                }));
            }
            if (data.armies[ws.battle.userid]){
                sendBattle(data);
            }
            else{
                var battle = battleLogic.join(data, ws.battle.userid);

                fs.store(`battle_${battle.id}`, battle).then(result => sendBattle(data));
            }            
        });
    });
}
