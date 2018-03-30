function requestMove(eventBus, bid, uid, x, y){
    Game.fetch().post(`/singlebattle/${bid}/${uid}/move/${x}/${y}`).then(data =>{
        eventBus.publish('update', data);
    });
}
function requestTurn(eventBus, bid, uid, x, y){
    Game.fetch().post(`/singlebattle/${bid}/${uid}/turn/${x}/${y}`).then(data =>{
        eventBus.publish('update', data);
    });
}
function requestAttack(eventBus, bid, uid, x, y){
    Game.fetch().post(`/singlebattle/${bid}/${uid}/attack/${x}/${y}`).then(data =>{
        eventBus.publish('update', data);
    });
}
