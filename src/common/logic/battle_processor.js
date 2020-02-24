var finalize = require('./turn_finalizer');
var directions = require('./directions');
var damage = require('./damage');
var bv = require('./battle_validator');

function processor(battle, playerId, helper){
    var validator = bv(battle);
    
    function processMove (unitId, x, y) {
        var turn = helper.getCurrentTurn();
        var unit = helper.getPlayerUnit(playerId, unitId);

        var r = validator.validateAction(turn, unit);
        if (r) {
            return r;
        }

        var { isValidMove, moveCost } = validator.isValidMove(unit, x, y);
        if (!isValidMove){
            return finalize(battle, turn, unit);
        }
        unit.pos = { x: x, y: y };
        unit.mobility -= moveCost;
        var isSkippingMove = moveCost == 0;
        if (isSkippingMove) {
            var dirSize = unit.directions.length + 2;
            directions.setDirections(unit, dirSize);            
        }
        else {
            unit.charge += moveCost;
            directions.setDirections(unit, 1);
        }
        if (unit.mobility > 0) {
            unit.mobility = 0;
        }
        else {
            unit.agility = 0;
        }

        if (!validator.canAttack(unit)) {
            unit.attacks = 0;
        }

        turn.moves.push({ unit: unit.id, from: unit.pos, to: { x: x, y: y } });

        return finalize(battle, turn, unit);
    }
    function processTurn (unitId, x, y) {
        var turn = helper.getCurrentTurn();
        var unit = helper.getPlayerUnit(playerId, unitId);

        var r = validator.validateAction(turn, unit);
        if (r) {
            return r;
        }

        var isValidTurn = validator.isValidTurn(unit, x, y);
        if (isValidTurn) {
            var dirSize = unit.directions.length;
            unit.directions = [directions.getDirection(unit.pos.x, unit.pos.y, x, y)];
            directions.setDirections(unit, dirSize);
        }
        unit.agility = 0;

        if (!validator.canAttack(unit)) {
            unit.attacks = 0;
        }

        turn.moves.push({ unit: unit.id, directions: unit.directions });

        return finalize(battle, turn, unit);
    }
    function processAttack (unitId, x, y) {
        var turn = helper.getCurrentTurn();
        var unit = helper.getPlayerUnit(playerId, unitId);

        var targetUnit = helper.getUnitAt(x, y);

        var r = validator.validateAction(turn, unit);
        if (r) {
            return r;
        }

        var isSkippingAttack = unit.pos.x == x && unit.pos.y == y;
        var isValidAttack = !helper.isSameArmy(unit, targetUnit);
        var inRangeAttack = validator.isValidAttack(unit, x, y);

        if (!isValidAttack || !inRangeAttack) {
            return {
                unit: unit,
                nextUnit: unit,
                targetUnit: unit,
                unitQueue: battle.unitQueue,
                battle: battle,
                success: false
            }
        }

        var attacksUsed = 1;

        if (isSkippingAttack) {
            attacksUsed = unit.attacks;
        }

        var dmg = 0;
        var unitExp = 0;
        var targetExp = 0;
        if (!isSkippingAttack && isValidAttack && inRangeAttack) {
            dmg = damage.applyDamage(unit, targetUnit);

            if (battle.mode == 'duel'){
                if (targetUnit.endurance == 0){
                    unitExp = dmg;
                }
                else{
                    unitExp = Math.ceil(dmg / 2);
                    targetExp = Math.ceil(dmg / 2);
                }
            }
        }

        unit.charge = 0;
        unit.attacks -= attacksUsed;

        turn.moves.push({ unit: unit.id, target: targetUnit.id, damage: dmg, unitExp: unitExp, targetExp: targetExp });

        return finalize(battle, turn, unit, targetUnit);
    }
    return {
        processCommand(command){
            if (command.cmd == 'move'){
                return processMove(command.uid, command.x, command.y);
            }
            else if (command.cmd == 'turn'){
                return processTurn(command.uid, command.x, command.y);
            }
            else if (command.cmd == 'attack'){
                return processAttack(command.uid, command.x, command.y);
            }
        }
    };
}

module.exports = processor;