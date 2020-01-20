var ws = null;
function initWebSocket(eventBus){
    return new Promise((resolve, reject) => {
        var battleId = sessionStorage.getItem('battleid');
        if (!battleId || battleId == 'null'){
            Game.fetch().post('/battle/start').then(data => {
                openWebSocket(data);
            });
        }
        else{
            openWebSocket(battleId); 
        }
        
        function openWebSocket(battleId){
            var wsProtocol = 'ws';
            if (window.location.protocol === "https:") {
                wsProtocol = 'wss';
            }
            ws = new WebSocket(`${wsProtocol}://${window.location.host}?bid=${battleId}`);
            ws.onmessage = function (event) {
                var data = JSON.parse(event.data);
                if (data.msg == 'data'){
                    resolve(data.data);
                }
                else if (data.msg == 'upd'){
                    eventBus.publish('update', data.data);
                }
                else if (data.msg == 'end'){
                    eventBus.publish('end', data.data);
                }
            };
            ws.onerror = function (error) {
                reject(error);
            };
            window.addEventListener('beforeunload', function () { ws.close(); });
        }
    });
}

function requestMove(eventBus, bid, uid, x, y){
    ws.send(JSON.stringify({
        cmd: 'move',
        uid: uid,
        x: x,
        y: y
    }));
}
function requestTurn(eventBus, bid, uid, x, y){
    ws.send(JSON.stringify({
        cmd: 'turn',
        uid: uid,
        x: x,
        y: y
    }));
}
function requestAttack(eventBus, bid, uid, x, y){
    ws.send(JSON.stringify({
        cmd: 'attack',
        uid: uid,
        x: x,
        y: y
    }));
}