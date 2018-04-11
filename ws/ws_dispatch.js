const WebSocket = require('ws');
var storage = require('../storage/arango/arango_storage');
var battleScope = require('../logic/battle_scope');
var armyUpd = require('../logic/army_updater');

function broadcast(wss, userIds, payload, beforeSend){
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && userIds.some(uid => client.battle.userid == uid)) {
            if (beforeSend){
                beforeSend(client.battle.userid, payload);
            }
            client.send(JSON.stringify(payload));
        }
    });
}

function sendBattleMessages(wss, battle){
    var uids = Object.keys(battle.armies);
    var payload = {
        msg: 'data',
        data: battle
    };
    broadcast(wss, uids, payload, (uid, pl) => pl.data.selfArmy = uid);
}

function sendUpdateMessages(wss, result){
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

function sendEndMessages(wss, result){
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
    async sendComplete(wss, wsdata){
        var data = await storage.battles.get(wsdata.id);
        if (data){
            if (data.armies[wsdata.userid] || Math.round((new Date().getTime() - new Date(data.created).getTime()) / 60000) > 60){
                sendBattleMessages(wss, data);
            }
            else{
                var army = await storage.armies.getBy('playerId', wsdata.userid);
                var battle = battleScope(data, wsdata.userid, wsdata.username).join(army);
                await storage.battles.store(battle);
                sendBattleMessages(wss, data);
            }   
        }
    },
    async sendUpdate(wss, wsdata, cmd){
        var data = await storage.battles.get(wsdata.id);
        var result = battleScope(data, wsdata.userid, wsdata.username).processCommand(cmd);
        if (result && result.success){
            await storage.battles.store(result.battle);
            if (result.ended){
                for(var i in result.experience){
                    if (result.experience.hasOwnProperty(i)) {
                        var army = await storage.armies.get(i);
                        armyUpd(army, result.experience[i]);
                        await storage.armies.store(army);
                    }
                }
                
                sendEndMessages(wss, result);
            }
            else{
                sendUpdateMessages(wss, result);
            }
        }
    }
}