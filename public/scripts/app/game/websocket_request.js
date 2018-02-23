var ws = null;
function initWebSocket(eventBus, onInitCallback){
    ws = new WebSocket('ws://' + window.location.host + '?bid=' + sessionStorage.getItem('battleid'));
    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      if (data.msg == 'data'){
        onInitCallback(data.data);
      }
      else if (data.msg == 'upd'){
        eventBus.publish('update', data.data);
      }
    };
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