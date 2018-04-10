var crypto = require("crypto");
var rand = require('./position_randomizer');
var uh = require('./unit_helper');

function battleLogic(battle, playerId, playerName, helper) {
    return {
        init: (unitTypes, army) => {
            battle.created = new Date().toISOString();
            battle.armies = {};
            battle.armies[playerId] = {};
            battle.armies[playerId].units = rand(battle.terrain, army, false);
            battle.armies[playerId].id = playerId;
            battle.armies[playerId].armyId = army.id;
            battle.armies[playerId].name = playerName;
            battle.id = crypto.randomBytes(8).toString("hex");
            battle.selfArmy = playerId;
            battle.unitTypes = unitTypes;
            battle.turns = [{
                readyUnits: [],
                movedUnits: [],
                moves: []
            }];

            return battle;
        },
        join: (army) => {
            if (battle.armies[playerId]) {
                return;
            }
            battle.started = new Date().toISOString();
            battle.armies[playerId] = {};
            battle.armies[playerId].units = rand(battle.terrain, army, true);
            battle.armies[playerId].id = playerId;
            battle.armies[playerId].armyId = army.id;
            battle.armies[playerId].name = playerName;
            allUnits = helper.getAllUnits();
            allUnits.forEach(u => {
                u = uh.restore.firstTurn(u, battle.unitTypes[u.type])
            });
            var sortedUnits = allUnits.sort((a, b) => a.speed < b.speed).map(x => x.id);
            battle.turns = [{
                readyUnits: sortedUnits,
                movedUnits: [],
                moves: []
            }];

            return battle;
        }
    }
};

module.exports = battleLogic;