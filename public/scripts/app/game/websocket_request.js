var ws = null;
function initWebSocket(websocket){
    ws = websocket;
}

function requestMove(uid, x, y){
    return new Promise((resolve, reject) => {
        ws.send({
            cmd: 'move',
            uid: uid,
            x: x,
            y: y
        });
    });
}
function requestTurn(url, bid, uid, x, y){
    return new Promise((resolve, reject) => {
        ws.send({
            cmd: 'turn',
            uid: uid,
            x: x,
            y: y
        });
    });
}
function requestAttack(url, bid, uid, x, y){
    return new Promise((resolve, reject) => {
        ws.send({
            cmd: 'attack',
            uid: uid,
            x: x,
            y: y
        });
    });
}