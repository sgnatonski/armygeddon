function requestMove(bid, uid, x, y){
    return Game.fetch().post(`/singlebattle/${bid}/${uid}/move/${x}/${y}`);
}
function requestTurn(bid, uid, x, y){
    return Game.fetch().post(`/singlebattle/${bid}/${uid}/turn/${x}/${y}`);
}
function requestAttack(bid, uid, x, y){
    return Game.fetch().post(`/singlebattle/${bid}/${uid}/attack/${x}/${y}`);
}
