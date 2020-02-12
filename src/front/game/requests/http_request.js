import eventBus from "../../app/eventBus";
import fetch from "../fetch";

export function requestMove(bid, uid, x, y) {
    fetch().post(`/singlebattle/${bid}/${uid}/move/${x}/${y}`).then(data =>{
        eventBus.publish(data.event, data);
    });
}
export function requestTurn(bid, uid, x, y){
    fetch().post(`/singlebattle/${bid}/${uid}/turn/${x}/${y}`).then(data =>{
        eventBus.publish(data.event, data);
    });
}
export function requestAttack(bid, uid, x, y){
    fetch().post(`/singlebattle/${bid}/${uid}/attack/${x}/${y}`).then(data =>{
        eventBus.publish(data.event, data);
    });
}
