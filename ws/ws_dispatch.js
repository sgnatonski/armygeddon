const WebSocket = require('ws');
var cote = require('cote');

var battleRequester = new cote.Requester({
    name: 'battle requester',
    namespace: 'battle'
});

function broadcast(wss, userIds, payload, beforeSend) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && userIds.some(uid => client.battle.userid == uid)) {
            if (beforeSend) {
                beforeSend(client.battle.userid, payload);
            }
            client.send(JSON.stringify(payload));
        }
    });
}

function sendBattleMessages(wss, battle) {
    var uids = Object.keys(battle.armies);
    var payload = {
        msg: 'data',
        data: battle
    };
    broadcast(wss, uids, payload, (uid, pl) => pl.data.selfArmy = uid);
}

function sendUpdateMessages(wss, result) {
    var uids = Object.keys(result.battle.armies);
    var payload = {
        msg: 'upd',
        data: {
            currUnit: result.unit,
            nextUnit: result.nextUnit,
            targetUnit: result.targetUnit,
            unitQueue: result.unitQueue
        }
    };
    broadcast(wss, uids, payload);
}

function sendEndMessages(wss, result) {
    var uids = Object.keys(result.battle.armies);
    var payload = {
        msg: 'end',
        data: {
            battle: result.battle,
            experience: result.experience
        }
    };
    broadcast(wss, uids, payload);
}

module.exports = {
    async sendComplete(wss, wsdata) {
        var battle = await battleRequester.send({ type: 'get', battleId: wsdata.id });
        if (!battle || battle.armies[wsdata.userid] || Math.round((new Date().getTime() - new Date(battle.created).getTime()) / 60000) <= 60) {
            battle = await battleRequester.send({ type: 'join', battleId: battle.id, playerId: wsdata.userid, name: wsdata.username });
        }
        sendBattleMessages(wss, battle);
    },
    async sendUpdate(wss, wsdata, cmd) {
        var result = await battleRequester.send({ type: 'process', battleId: wsdata.id, playerId: wsdata.userid, name: wsdata.username, cmd: cmd });
        if (result && result.success) {
            if (result.ended) {
                sendEndMessages(wss, result);
            }
            else {
                sendUpdateMessages(wss, result);
            }
        }
        return result;
    }
}