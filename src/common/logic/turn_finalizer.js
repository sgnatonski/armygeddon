var uh = require('./unit_helper');
var bh = require('./battle_helper');

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

function finalizeAction(battle, turn, unit, targetUnit){
    var helper = bh(battle);
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
    var allUnits = helper.getAllUnits();
    
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

    var armiesState = getArmiesEndurance(battle);

    if (armiesState.find(s => s.remaining == 0)){
        var winner = armiesState.find(s => s.remaining > 0);
        battle.winningArmy = winner.id;
        battle.ended = new Date().toISOString();

        var moves = battle.turns
            .map(x => x.moves)
            .reduce((a, b) => a.concat(b));
        var exp1 = moves.filter(x => x.unitExp > 0)
            .map(x => { return { armyId: helper.getUnitArmy(x.unit), unitId: x.unit, expGain: x.unitExp }});
        var exp2 = moves.filter(x => x.targetUnit && x.targetExp > 0)
            .map(x => { return { armyId: helper.getUnitArmy(x.targetUnit), unitId: x.targetUnit, expGain: x.targetExp }});

        var exp = exp1.concat(exp2).reduce((r, a) => {
            r[a.armyId] = r[a.armyId] || [];
            r[a.armyId].push(a);
            return r;
        }, {});

        return {
            battle: battle, 
            experience: exp,
            ended: true,
            success: true,
        };
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

module.exports = finalizeAction;