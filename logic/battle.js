var BHex = require('../dist/bhex');
var directions = require('./directions');
var resolver = require('./action_resolver');

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

function finalizeInvalidAction(battle, turn, unit){
    var isTurnMove = turn.readyUnits[0] == unit.id;
    if (!isTurnMove){
        return {
            unit: null, 
            nextUnit: null, 
            targetUnit: null,
            unitQueue: null, 
            battle: battle, 
            success: false
        };
    }
}

var unitRestore = {
    firstTurn: (unit, unitType) => {
        return Object.assign(unit, unitType, unitType.lifetime);
    },
    nextTurn: (unit, unitType) => {
        return Object.assign(unit, unitType);
    }
}

function finalizeAction(battle, turn, unit, targetUnit){
    if (unit.mobility == 0 && unit.agility == 0 && unit.attacks == 0){
        var id = turn.readyUnits.shift();
        turn.movedUnits.push(id);
    }
    if (targetUnit && targetUnit.endurance <= 0){
        var tidx = turn.readyUnits.indexOf(targetUnit.id);
        if (tidx >= 0){
            turn.readyUnits.splice(tidx, 1);
        }
        else{
            tidx = turn.movedUnits.indexOf(targetUnit.id);
            turn.movedUnits.splice(tidx, 1);
        }
    }
    if (!turn.readyUnits.length){
        battle.turns.push({
            readyUnits: turn.movedUnits,
            movedUnits: [],
            moves: []
        });

        getAllUnits(battle).forEach(u => {
            u = unitRestore.nextTurn(u, battle.unitTypes[u.type])
        });
    }

    var nextUnitId = battle.turns[battle.turns.length - 1].readyUnits[0];

    var allUnits = getAllUnits(battle);
    var nextUnit = allUnits.find(u => u.id == nextUnitId);
    var unitQueue = battle.turns[battle.turns.length - 1].readyUnits;

    return {
        unit: unit, 
        nextUnit: nextUnit, 
        targetUnit: targetUnit,
        unitQueue: unitQueue, 
        battle: battle, 
        success: true
    };
}

var battleLogic = {
    init: (battle) => {
        allUnits = getAllUnits(battle);
        allUnits.forEach(u => {
            u = unitRestore.firstTurn(u, battle.unitTypes[u.type])
        });
        var sortedUnits = allUnits.sort((a, b) => a.speed < b.speed).map(x => x.id);
        battle.turns.push({
            readyUnits: sortedUnits,
            movedUnits: [],
            moves: []
        });
        return battle;
    },
    processMove: (battle, playerId, unitId, x, y) => {
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];

        var r = finalizeInvalidAction(battle, turn, unit);
        if (r){
            return r;
        }

        var isSkippingMove = unit.pos.x == x && unit.pos.y == y;
        var isValidMove = false;
        var moveCost = unit.mobility;

        if (!isSkippingMove){
            var grid = new BHex.Grid(battle.terrainSize);
            getAllUnits(battle).forEach(u => {
                grid.getHexAt(new BHex.Axial(u.pos.x, u.pos.y)).blocked = true;
            });
            var path = grid.findPath(new BHex.Axial(unit.pos.x, unit.pos.y), new BHex.Axial(x, y));
            isValidMove = path.some(e => e.x == x && e.y == y);
            moveCost = path.map(x => x.cost).reduce((a,b) => a + b, 0);
        }

        turn.moves.push({ unit: unit.id, from: unit.pos, to: { x: x, y: y } });
        unit.pos = { x: x, y: y };
        unit.mobility -= moveCost;
        if (!isSkippingMove){
            unit.charge += moveCost;
        }
        if (unit.mobility > 0){
            unit.agility += 1;
            unit.mobility = 0;
        }

        return finalizeAction(battle, turn, unit);
    },
    processTurn: (battle, playerId, unitId, x, y) => {
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];

        var r = finalizeInvalidAction(battle, turn, unit);
        if (r){
            return r;
        }

        var grid = new BHex.Grid(battle.terrainSize);
        var neighbors = grid.getNeighbors(new BHex.Axial(unit.pos.x, unit.pos.y));
        var isValidTurn = neighbors.some(e => e.x == x && e.y == y);
        if (isValidTurn){
            unit.directions = [directions(unit.pos.x, unit.pos.y, x, y)];
        }
        unit.agility = 0;

        return finalizeAction(battle, turn, unit);
    },
    processAttack: (battle, playerId, unitId, x, y) => {
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];
        var targetUnit = getUnitAt(battle, x, y);

        var r = finalizeInvalidAction(battle, turn, unit);
        if (r){
            return r;
        }

        var isSkippingAttack = unit.pos.x == x && unit.pos.y == y;
        var isValidAttack = targetUnit != null 
            ? !isSameArmy(battle.armies[playerId], targetUnit)
            : false;
        var grid = new BHex.Grid(battle.terrainSize);
        var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
        var inRangeAttack = gridRange.some(r => r.x == x && r.y == y);

        var attacksUsed = 1;

        if (isSkippingAttack){
            attacksUsed = unit.attacks;          
        }

        if (!isSkippingAttack && isValidAttack && inRangeAttack){            
            resolver.applyAttackDamage(unit, targetUnit);
        }

        unit.attacks -= attacksUsed;

        return finalizeAction(battle, turn, unit, targetUnit);
    }
};

module.exports = battleLogic;