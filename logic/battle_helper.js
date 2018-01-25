var BHex = require('../dist/bhex');

function getAllUnits(battle){
    return Object.keys(battle.armies).map(key => Object.keys(battle.armies[key].units).map(unitId => battle.armies[key].units[unitId]))
        .reduce((a, b) => a.concat(b));
}

function getUnitAt(battle, x, y){
    return getAllUnits(battle).find(u => u.pos.x == x && u.pos.y == y);
}

function isSameArmy(battle, unit1, unit2){
    if (!unit1 || !unit2){
        return false;
    }
    
    var armies = Object.keys(battle.armies)
        .map(a => battle.armies[a])
        .map(army => {
            return { 
                id: army.id, 
                army: Object.keys(army.units).map(u => army.units[u])
            }
        });
    var unit1Army = armies[0].army.find(u => u.id == unit1.id);
    var army = armies[0].army;
    if (!unit1Army){
        unit1Army = armies[1].army.find(u => u.id == unit1.id);
        army = armies[1].army;
    }
    return army.some(u => u.id == unit2.id);
}

function getPlayerUnit(battle, playerId, unitId) {
    if (Array.isArray(playerId)){
        if (!battle.armies[playerId[0]]){
            return null;
        }
        if (!battle.armies[playerId[1]]){
            return null;
        }

        var unit = battle.armies[playerId[0]].units[unitId];
        if (!unit){
            unit = battle.armies[playerId[1]].units[unitId];
        }
        return unit;
    }
    else{
        if (!battle.armies[playerId]){
            return null;
        }
    
        var unit = battle.armies[playerId].units[unitId];
        return unit;
    }
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

function isValidMove(battle, unit, x, y){
    var grid = new BHex.Grid(getBattleSize(battle));
    getAllUnits(battle).forEach(u => {
        grid.getHexAt(new BHex.Axial(u.pos.x, u.pos.y)).blocked = true;
    });
    var path = grid.findPath(new BHex.Axial(unit.pos.x, unit.pos.y), new BHex.Axial(x, y));
    isValidMove = path.some(e => e.x == x && e.y == y);
    moveCost = path.map(x => x.cost).reduce((a,b) => a + b, 0);
    return {
        isValidMove: isValidMove && moveCost <= unit.mobility, 
        moveCost
    };
}

function isValidTurn(battle, unit, x, y){
    var grid = new BHex.Grid(getBattleSize(battle));
    var neighbors = grid.getNeighbors(new BHex.Axial(unit.pos.x, unit.pos.y));
    return neighbors.some(e => e.x == x && e.y == y);
}

function isValidAttack(battle, unit, x, y){
    var grid = new BHex.Grid(getBattleSize(battle));
    var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
    return gridRange.some(r => r.x == x && r.y == y);
}

function canAttack(battle, unit){
    var grid = new BHex.Grid(getBattleSize(battle));
    var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
    var unitsToAttack = gridRange.map(r => getUnitAt(battle, r.x, r.y)).filter(r => r && r.endurance > 0);
    return unitsToAttack.some(u => !isSameArmy(battle, unit, u));        
}

module.exports = {
    getAllUnits,
    getPlayerUnit,
    getUnitAt,
    isSameArmy,
    getArmiesEndurance,
    getCurrentTurn,
    getBattleSize,
    isValidMove,
    isValidTurn,
    isValidAttack,
    canAttack
};