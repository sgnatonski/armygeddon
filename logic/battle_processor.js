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
        var isSkippingMove = moveCost == 0;
        unit.pos = { x: x, y: y };
        unit.mobility -= moveCost;
        if (!isSkippingMove) {
            unit.charge += moveCost;
            directions.setDirections(unit, 1);
        }
        else {
            var dirSize = unit.directions.length + 2;
            directions.setDirections(unit, dirSize);
        }
        if (unit.mobility > 0) {
            unit.mobility = 0;
        }
        else {
            unit.agility = 0
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

        var oldTargetEndurance = targetUnit.endurance;
        var attacksUsed = 1;

        if (isSkippingAttack) {
            attacksUsed = unit.attacks;
        }

        if (!isSkippingAttack && isValidAttack && inRangeAttack) {
            damage.applyDamage(unit, targetUnit);
        }

        unit.attacks -= attacksUsed;

        turn.moves.push({ unit: unit.id, target: targetUnit.id, damage: oldTargetEndurance - targetUnit.endurance });

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