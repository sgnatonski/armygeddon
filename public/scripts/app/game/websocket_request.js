var ws = null;
function initWebSocket(eventBus, onInitCallback){
    var battleId = sessionStorage.getItem('battleid');
    if (!battleId || battleId == 'null'){
        return Game.fetch().post('/battle/start').then(data => {
            openWebSocket(data);
        });
    }
    else{
        openWebSocket(battleId); 
    }
    
    function openWebSocket(battleId){
        ws = new WebSocket(`wss://${window.location.host}?bid=${battleId}`);
        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if (data.msg == 'data'){
                onInitCallback(data.data);
            }
            else if (data.msg == 'upd'){
                eventBus.publish('update', data.data);
            }
        };
        window.addEventListener('beforeunload', function () { ws.close(); });
    }
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