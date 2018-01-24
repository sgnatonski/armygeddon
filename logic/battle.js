var crypto = require("crypto");
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
    if (battle.winningArmy || !isTurnMove){
        return {
            unit: unit, 
            nextUnit: unit, 
            targetUnit: unit,
            unitQueue: battle.unitQueue, 
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

function finalizeAction(battle, turn, playerId, unit, targetUnit){
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
    var allUnits = getAllUnits(battle);
    
    if (!turn.readyUnits.length){
        battle.turns.push({
            readyUnits: turn.movedUnits,
            movedUnits: [],
            moves: []
        });

        allUnits.forEach(u => {
            u = unitRestore.nextTurn(u, battle.unitTypes[u.type])
        });
    }

    var nextUnitId = battle.turns[battle.turns.length - 1].readyUnits[0];

    var nextUnit = allUnits.find(u => u.id == nextUnitId);
    var unitQueue = battle.turns[battle.turns.length - 1].readyUnits;

    var armiesState = Object.keys(battle.armies)
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

    if (armiesState.find(s => s.remaining == 0)){
        var winner = armiesState.find(s => s.remaining > 0);
        battle.winningArmy = winner.id;
    }

    return {
        unit: unit, 
        nextUnit: nextUnit, 
        targetUnit: targetUnit,
        unitQueue: unitQueue, 
        battle: battle, 
        success: true
    };
}

function ensureDirRange(dir){
    if (dir > 6) return 1;
    if (dir < 1) return 6;
    return dir;
}

function setDirections(unit, dirSize){
    if (dirSize > unit.maxDirections){
        dirSize = unit.maxDirections;
    }
    currentDir = unit.directions[0];
    unit.directions = Array(dirSize);
    unit.directions[0] = currentDir;
    var i = 1;
    while(i < dirSize){
        unit.directions[i] = ensureDirRange(unit.directions[0] + i);
        unit.directions[i + 1] = ensureDirRange(unit.directions[0] - i);
        i = i + 2;
    }
}

var battleLogic = {
    init: (battle, playerId, battleId) => {
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
        if (battle.armies['1']){
            battle.armies[playerId] = battle.armies['1'];
            battle.armies[playerId].id = playerId;
            delete battle.armies['1'];
        
            battle.armies[playerId + '[clone]'] = battle.armies['2'];
            battle.armies[playerId + '[clone]'].id = playerId + '[clone]';
            delete battle.armies['2'];
        }
        battle.id = battleId ? battleId : crypto.randomBytes(8).toString("hex");
        return battle;
    },
    processMove: (battle, playerId, unitId, x, y) => {        
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];
        if (!unit){
            unit = battle.armies[playerId + '[clone]'].units[unitId];
        }

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
            setDirections(unit, 1);
        }
        else{
            var dirSize = unit.directions.length + 2;
            setDirections(unit, dirSize);
        }
        if (unit.mobility > 0){
            unit.agility += 1;
            unit.mobility = 0;
        }

        return finalizeAction(battle, turn, playerId, unit);
    },
    processTurn: (battle, playerId, unitId, x, y) => {
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];
        var fixClone = false;
        if (!unit){
            unit = battle.armies[playerId + '[clone]'].units[unitId];
            fixClone = true;
        }

        var r = finalizeInvalidAction(battle, turn, unit);
        if (r){
            return r;
        }

        var grid = new BHex.Grid(battle.terrainSize);
        var neighbors = grid.getNeighbors(new BHex.Axial(unit.pos.x, unit.pos.y));
        var isValidTurn = neighbors.some(e => e.x == x && e.y == y);
        if (isValidTurn){
            var dirSize = unit.directions.length;
            unit.directions = [directions(unit.pos.x, unit.pos.y, x, y)];
            setDirections(unit, dirSize);
        }
        unit.agility = 0;

        var grid = new BHex.Grid(battle.terrainSize);
        var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
        var unitsToAttack = gridRange.map(r => getUnitAt(battle, r.x, r.y)).filter(r => r && r.endurance > 0);
        var canAttack = unitsToAttack.some(u => !isSameArmy(battle.armies[fixClone ? playerId + '[clone]' : playerId], u));
        if (!canAttack){
            unit.attacks = 0;
        }

        turn.moves.push({ unit: unit.id, directions: unit.directions});

        return finalizeAction(battle, turn, playerId, unit);
    },
    processAttack: (battle, playerId, unitId, x, y) => {
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[playerId].units[unitId];
        var fixClone = false;
        if (!unit){
            unit = battle.armies[playerId + '[clone]'].units[unitId];
            fixClone = true;
        }

        var targetUnit = getUnitAt(battle, x, y);

        var r = finalizeInvalidAction(battle, turn, unit);
        if (r){
            return r;
        }

        var isSkippingAttack = unit.pos.x == x && unit.pos.y == y;
        var isValidAttack = targetUnit != null 
            ? !isSameArmy(battle.armies[fixClone ? playerId + '[clone]' : playerId], targetUnit)
            : false;
        var grid = new BHex.Grid(battle.terrainSize);
        var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
        var inRangeAttack = gridRange.some(r => r.x == x && r.y == y);

        var oldTargetEndurance = targetUnit.endurance;
        var attacksUsed = 1;

        if (isSkippingAttack){
            attacksUsed = unit.attacks;          
        }

        if (!isSkippingAttack && isValidAttack && inRangeAttack){            
            resolver.applyAttackDamage(unit, targetUnit);
        }

        unit.attacks -= attacksUsed;

        turn.moves.push({ unit: unit.id, target: targetUnit.id, damage: oldTargetEndurance - targetUnit.endurance});

        return finalizeAction(battle, turn, playerId, unit, targetUnit);
    }
};

module.exports = battleLogic;