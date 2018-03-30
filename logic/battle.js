var crypto = require("crypto");
var directions = require('./directions');
var resolver = require('./action_resolver');
var uh = require('./unit_helper');
var bh = require('./battle_helper');

function validateAction(battle, turn, unit){
    var isTurnMove = unit ? turn.readyUnits[0] == unit.id : false;
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
    var allUnits = bh.getAllUnits(battle);
    
    if (!turn.readyUnits.length){
        battle.turns.push({
            readyUnits: turn.movedUnits,
            movedUnits: [],
            moves: []
        });

        allUnits.forEach(u => {
            u = uh.restore.nextTurn(u, battle.unitTypes[u.type])
        });
    }

    var nextUnitId = battle.turns[battle.turns.length - 1].readyUnits[0];

    var nextUnit = allUnits.find(u => u.id == nextUnitId);
    var unitQueue = battle.turns[battle.turns.length - 1].readyUnits;

    var armiesState = bh.getArmiesEndurance(battle);

    if (armiesState.find(s => s.remaining == 0)){
        var winner = armiesState.find(s => s.remaining > 0);
        battle.winningArmy = winner.id;
        battle.ended = new Date().toISOString();        
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

function assignRandomFields(terrain, army, righSide){
    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    const grouped = Array.from(groupBy(terrain, t => t.y));
    var ls = grouped.map(function(key) {
        var value = key[1].sort((a, b) => righSide ? a.x < b.x : a.x > b.x);
        var half_length = Math.ceil(value.length / 4);
        var side = value.splice(0, half_length);
        return side;
    }).reduce((a, b) => a.concat(b));

    shuffleArray(ls);

    return army.units.map((u, i) => Object.assign({
        pos: { x: ls[i].x, y: ls[i].y },
        directions: righSide ? [4] : [1] 
    }, u)).reduce(function(acc, cur) {
        acc[cur.id] = cur;
        return acc;
    }, {});
}

var battleLogic = {
    init: (battle, playerId, battleId, unitTypes, army) => {   
        battle.created = new Date().toISOString();     
        battle.armies = {};
        battle.armies[playerId] = {};
        battle.armies[playerId].units = assignRandomFields(battle.terrain, army, false);
        battle.armies[playerId].id = playerId;
        battle.id = battleId ? battleId : crypto.randomBytes(8).toString("hex");
        battle.selfArmy = playerId;
        battle.unitTypes = unitTypes;

        battle.turns = [{
            readyUnits: [],
            movedUnits: [],
            moves: []
        }];
        
        return battle;
    },
    join: (battle, playerId, army) =>{
        if (battle.armies[playerId]){
            return;
        }
        battle.started = new Date().toISOString();     
        battle.armies[playerId] = {};
        battle.armies[playerId].units = assignRandomFields(battle.terrain, army, true);
        battle.armies[playerId].id = playerId;
        allUnits = bh.getAllUnits(battle);
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
    },
    processMove: (battle, playerId, unitId, x, y) => {        
        var turn = bh.getCurrentTurn(battle);
        var unit = bh.getPlayerUnit(battle, playerId, unitId);

        var r = validateAction(battle, turn, unit);
        if (r){
            return r;
        }

        var {isValidMove, moveCost} = bh.isValidMove(battle, unit, x, y);
        var isSkippingMove = moveCost == 0;
        
        turn.moves.push({ unit: unit.id, from: unit.pos, to: { x: x, y: y } });
        unit.pos = { x: x, y: y };
        unit.mobility -= moveCost;
        if (!isSkippingMove){
            unit.charge += moveCost;
            uh.setDirections(unit, 1);
        }
        else{
            var dirSize = unit.directions.length + 2;
            uh.setDirections(unit, dirSize);
        }
        if (unit.mobility > 0){
            unit.mobility = 0;
        }
        else{
            unit.agility = 0
        }

        if (!bh.canAttack(battle, unit)){
            unit.attacks = 0;
        }

        return finalizeAction(battle, turn, unit);
    },
    processTurn: (battle, playerId, unitId, x, y) => {
        var turn = bh.getCurrentTurn(battle);
        var unit = bh.getPlayerUnit(battle, playerId, unitId);
        
        var r = validateAction(battle, turn, unit);
        if (r){
            return r;
        }

        var isValidTurn = bh.isValidTurn(battle, unit, x, y);
        if (isValidTurn){
            var dirSize = unit.directions.length;
            unit.directions = [directions(unit.pos.x, unit.pos.y, x, y)];
            uh.setDirections(unit, dirSize);
        }
        unit.agility = 0;

        if (!bh.canAttack(battle, unit)){
            unit.attacks = 0;
        }

        turn.moves.push({ unit: unit.id, directions: unit.directions});

        return finalizeAction(battle, turn, unit);
    },
    processAttack: (battle, playerId, unitId, x, y) => {
        var turn = bh.getCurrentTurn(battle);
        var unit = bh.getPlayerUnit(battle, playerId, unitId);
        
        var targetUnit = bh.getUnitAt(battle, x, y);

        var r = validateAction(battle, turn, unit);
        if (r){
            return r;
        }

        var isSkippingAttack = unit.pos.x == x && unit.pos.y == y;
        var isValidAttack = !bh.isSameArmy(battle, unit, targetUnit);
        var inRangeAttack = bh.isValidAttack(battle, unit, x, y);

        if (!isValidAttack || !inRangeAttack){
            return {
                unit: unit, 
                nextUnit: unit, 
                targetUnit: unit,
                unitQueue: battle.unitQueue, 
                battle: battle, 
                success: false
            }
        }
        
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

        return finalizeAction(battle, turn, unit, targetUnit);
    }
};

module.exports = battleLogic;