function getAllUnits(battle){
    return Object.keys(battle.armies).map(key => Object.keys(battle.armies[key].units).map(unitId => battle.armies[key].units[unitId]))
        .reduce((a, b) => a.concat(b));
}

function getUnitAt(battle, x, y){
    return getAllUnits(battle).find(u => u.pos.x == x && u.pos.y == y);
}

function isSameArmy(army, unit){
    return Object.keys(army.units).map(unitId => army.units[unitId]).find(u => u.id == unit.id);
}

function getPlayerUnit(battle, playerId, unitId) {
    if (!battle.armies[playerId]){
        return null;
    }

    var unit = battle.armies[playerId].units[unitId];
    if (!unit){
        unit = battle.armies[playerId + '[clone]'].units[unitId];
    }
    return unit;
}
function getCurrentTurn(battle){
    return battle.turns[battle.turns.length - 1];
}

function getArmiesEndurance(battle){
    return Object.keys(battle.armies)
        .map(a => battle.armies[a])
        .map(army => {
            return { 
                id: army.id, 
                army: Object.keys(army.units).map(u => army.units[u])
            }
        })
        .map(x => {
            return { 
                id: x.id,
                remaining: x.army.map(u => u.endurance).reduce((a, b) => a + b, 0)
            }
        });
}

function getBattleSize(battle){
    var tx = battle.terrain.map(x => x.x);
    var ty = battle.terrain.map(x => x.y);
    var minX = Math.abs(Math.min(...tx));
    var maxX = Math.abs(Math.max(...tx));
    var minY = Math.abs(Math.min(...ty));
    var maxY = Math.abs(Math.max(...ty));
    var size = Math.max(...[minX, maxX, minY, maxY]);
    return size; 
}

module.exports = {
    getAllUnits,
    getPlayerUnit,
    getUnitAt,
    isSameArmy,
    getArmiesEndurance,
    getCurrentTurn,
    getBattleSize
};