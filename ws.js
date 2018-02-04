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

        fs.exists(`battle_${ws.battle.id}`).then(exists => {
            if (exists){
                fs.get(`battle_${ws.battle.id}`).then(data => {
                    var battle = battleLogic.join(battle, ws.battle.userid2);
        
                    fs.store(`battle_${battle.id}`, battle)
                        .then(result => ws.send(JSON.stringify({
                            msg: 'data',
                            data: data
                        })));
                });
            }
            else{
                fs.get('init.battle').then(data => {
                    var battle = battleLogic.init(data, ws.battle.userid, ws.battle.id);
        
                    fs.store(`battle_${battle.id}`, battle)
                        .then(result => ws.send(JSON.stringify({
                            msg: 'data',
                            data: data
                        })));
                });
            }
        });
    });
}
