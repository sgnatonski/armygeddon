var express = require('express');
var fs = require('fs');
var BHex = require('../dist/bhex');
var router = express.Router();

var unitRestore = {
    firstTurn: (unit, unitType) => {
        return Object.assign(unit, unitType, unitType.lifetime);
    },
    nextTurn: (unit, unitType) => {
        return Object.assign(unit, unitType);
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('./data/init.battle.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var battle = JSON.parse(data);
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

        fs.writeFile("./data/battle.json", JSON.stringify(battle), function(err) {
            if (err) throw err; // we'll not consider error handling for now
            res.json(battle);
        });
    });
});

router.post('/:pid/:uid/move/:x/:y', function(req, res, next) {
    fs.readFile('./data/battle.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var battle = JSON.parse(data);
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[req.params.pid].units[req.params.uid];
        var target = { x: parseInt(req.params.x), y: parseInt(req.params.y) };

        var isTurnMove = turn.readyUnits[0] == unit.id;
        
        var isSkippingMove = unit.pos.x == target.x && unit.pos.y == target.y;
        var isValidMove = false;
        var moveCost = unit.mobility;

        if (isTurnMove && !isSkippingMove){
            var grid = new BHex.Grid(battle.terrainSize);
            getAllUnits(battle).forEach(u => {
                grid.getHexAt(new BHex.Axial(u.pos.x, u.pos.y)).blocked = true;
            });
            var path = grid.findPath(new BHex.Axial(unit.pos.x, unit.pos.y), new BHex.Axial(target.x, target.y));
            isValidMove = path.some(e => e.x == target.x && e.y == target.y);
            moveCost = path.map(x => x.cost).reduce((a,b) => a + b, 0);
        }

        if (isSkippingMove || isValidMove){
            turn.moves.push({ unit: id, from: unit.pos, to: target });
            unit.pos = target;
            unit.mobility -= moveCost;
            if (unit.mobility == 0 && unit.attacts == 0){
                var id = turn.readyUnits.shift();
                turn.movedUnits.push(id);
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

            fs.writeFile("./data/battle.json", JSON.stringify(battle), function(err) {
                if (err) throw err; // we'll not consider error handling for now
                res.json({
                    currUnit: unit, 
                    nextUnit: nextUnit,
                    unitQueue: battle.turns[battle.turns.length - 1].readyUnits
                });
            });
        }
        else{
            res.status(403);
        }
    });
});

router.post('/:pid/:uid/attack/:x/:y', function(req, res, next) {
    fs.readFile('./data/battle.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var battle = JSON.parse(data);
        var turn = battle.turns[battle.turns.length - 1];

        var unit = battle.armies[req.params.pid].units[req.params.uid];
        var target = { x: parseInt(req.params.x), y: parseInt(req.params.y) };
        var targetUnit = getUnitAt(battle, target.x, target.y);

        var isTurnMove = turn.readyUnits[0] == unit.id;
        var isSkippingAttack = unit.pos.x == target.x && unit.pos.y == target.y;
        var isValidAttack = targetUnit != null 
            ? !isSameArmy(battle.armies[req.params.pid], targetUnit)
            : false;

        if (isSkippingAttack || isTurnMove && isValidAttack){
            unit.attacks -= 1;
            if (!isSkippingAttack){
                targetUnit.endurance -= unit.damage;

                if (targetUnit.endurance <= 0){
                    var tidx = turn.readyUnits.indexOf(targetUnit.id);
                    if (tidx >= 0){
                        turn.readyUnits.splice(tidx, 1);
                    }
                    else{
                        tidx = turn.movedUnits.indexOf(targetUnit.id);
                        turn.movedUnits.splice(tidx, 1);
                    }
                }
            }

            if (unit.mobility == 0 && unit.attacks == 0){
                var id = turn.readyUnits.shift();
                turn.movedUnits.push(id);
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

            fs.writeFile("./data/battle.json", JSON.stringify(battle), function(err) {
                if (err) throw err; // we'll not consider error handling for now
                res.json({
                    currUnit: unit, 
                    nextUnit: nextUnit,
                    unitQueue: battle.turns[battle.turns.length - 1].readyUnits
                });
            });
        }
        else{
            res.status(403);
        }
    });
});

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

module.exports = router;
