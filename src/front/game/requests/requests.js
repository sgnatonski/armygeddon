import * as httpReq from './http_request';
import * as wsReq from './websocket_request';
import fetch from "../fetch";

export default function(single){
    if (single){
        var battleid = sessionStorage.getItem('singlebattleid');
        var url = `/singlebattle/join/${battleid ? battleid : ''}`;

        return {
            requestMove: httpReq.requestMove,
            requestTurn: httpReq.requestTurn,
            requestAttack: httpReq.requestAttack,
            dataPromise: fetch().post(url)
        };
    }

    return {
        requestMove: wsReq.requestMove,
        requestTurn: wsReq.requestTurn,
        requestAttack: wsReq.requestAttack,
        dataPromise: wsReq.initWebSocket()
    };
}