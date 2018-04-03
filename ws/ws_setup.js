const WebSocket = require('ws');
var url = require('url');
var jwt = require('jsonwebtoken');
var dispatch = require('./ws_dispatch');

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

    wss.on('connection', async (ws, req) => {
        const parameters = url.parse(req.url, true);
        var user = jwt.verify(req.cookies.a_token, tokenSecret);

        ws.battle = {
            id: parameters.query.bid,
            userid: user.id,
            username: user.name
        };

        ws.on('error', err => {
            console.log("error!: " + err);
        });

        ws.on('message', async command => {            
            await dispatch.sendUpdate(wss, ws.battle, JSON.parse(command));
        });

        await dispatch.sendComplete(wss, ws.battle);
    });
}