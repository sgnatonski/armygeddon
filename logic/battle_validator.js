var BHex = require('../dist/bhex');
var bh = require('./battle_helper');

function validator(battle) {
    function getBattleSize() {
        var tx = battle.terrain.map(x => x.x);
        var ty = battle.terrain.map(x => x.y);
        var minX = Math.abs(Math.min(...tx));
        var maxX = Math.abs(Math.max(...tx));
        var minY = Math.abs(Math.min(...ty));
        var maxY = Math.abs(Math.max(...ty));
        var size = Math.max(...[minX, maxX, minY, maxY]);
        return size;
    }
    var helper = bh(battle);
    var battleSize = getBattleSize();
    return {
        isValidMove(unit, x, y) {
            var grid = new BHex.Grid(battleSize);
            helper.getAllUnits().forEach(u => {
                grid.getHexAt(new BHex.Axial(u.pos.x, u.pos.y)).blocked = true;
            });
            var path = grid.findPath(new BHex.Axial(unit.pos.x, unit.pos.y), new BHex.Axial(x, y));
            isValidMove = path.some(e => e.x == x && e.y == y);
            moveCost = path.map(x => x.cost).reduce((a, b) => a + b, 0);
            return {
                isValidMove: isValidMove && moveCost <= unit.mobility,
                moveCost
            };
        },
        isValidTurn(unit, x, y) {
            var grid = new BHex.Grid(battleSize);
            var neighbors = grid.getNeighbors(new BHex.Axial(unit.pos.x, unit.pos.y));
            return neighbors.some(e => e.x == x && e.y == y);
        },
        isValidAttack(unit, x, y) {
            var grid = new BHex.Grid(battleSize);
            var gridRange = grid.getRange(new BHex.Axial(unit.pos.x, unit.pos.y), unit.range, true);
            var targetUnit = helper.getUnitAt(x, y);
            return targetUnit && gridRange.some(r => r.x == x && r.y == y);
        },
        canAttack(unit) {
            var grid = new BHex.Grid(battleSize);
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