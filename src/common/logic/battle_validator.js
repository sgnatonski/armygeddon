var BHex = require('../bhex.backend');
var bh = require('./battle_helper');
var directions = require('./directions');

function validator(battle) {
    var helper = bh(battle);
    return {
        isValidMove(unit, x, y) {
            if (unit.pos.x == x && unit.pos.y == y){
                return {
                    isValidMove: true,
                    moveCost: 0 
                };
            }
            var grid = new BHex.Grid(battle.sceneSize);
            helper.getAllUnits().forEach(u => {
                grid.getHexAt(new BHex.Axial(u.pos.x, u.pos.y)).blocked = true;
            });
            var path = [];
            if (!unit.agility){
                path = grid.findPath(new BHex.Axial(unit.pos.x, unit.pos.y), new BHex.Axial(x, y));
            }
            else{
                var posStart = new BHex.Axial(unit.pos.x, unit.pos.y);
                path = grid.findPath(posStart, new BHex.Axial(x, y));
                if (path.length){
                    var dirPos = directions.getTurns()[unit.directions[0] - 1];
                    var posEnd = new BHex.Axial(unit.pos.x + (dirPos.x * (unit.mobility - 1)), unit.pos.y + (dirPos.y * (unit.mobility - 1)));        
                    var gridRange = grid.getConeRange(posStart, posEnd, unit.mobility);
                    path = path.filter(x => gridRange.some(g => g.x == x.x && g.y == x.y));
                }
            }
            isValidMove = path.some(e => e.x == x && e.y == y);
            moveCost = path.map(x => x.cost).reduce((a, b) => a + b, 0);
            return {
                isValidMove: isValidMove && moveCost <= unit.mobility,
                moveCost
            };
        },
        isValidTurn(unit, x, y) {
            var grid = new BHex.Grid(battle.sceneSize);
            var neighbors = grid.getNeighbors(new BHex.Axial(unit.pos.x, unit.pos.y));
            return neighbors.some(e => e.x == x && e.y == y);
        },
        isValidAttack(unit, x, y) {
            var grid = new BHex.Grid(battle.sceneSize);
            var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
            var targetUnit = helper.getUnitAt(x, y);
            return targetUnit && gridRange.some(r => r.x == x && r.y == y);
        },
        canAttack(unit) {
            var grid = new BHex.Grid(battle.sceneSize);
            var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
            var unitsToAttack = gridRange.map(r => helper.getUnitAt(r.x, r.y)).filter(r => r && r.endurance > 0);
            return unitsToAttack.some(u => !helper.isSameArmy(unit, u));
        },
        validateAction(turn, unit) {
            var isTurnMove = unit ? turn.readyUnits[0] == unit.id : false;
            if (battle.winningArmy || !isTurnMove) {
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
    }
}

module.exports = validator;