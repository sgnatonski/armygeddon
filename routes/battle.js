var express = require('express');
var fs = require('fs');
var router = express.Router();
var battleLogic = require('../logic/battle');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('./data/init.battle.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var battle = battleLogic.init(JSON.parse(data));

        fs.writeFile("./data/battle.json", JSON.stringify(battle), function(err) {
            if (err) throw err; // we'll not consider error handling for now
            res.json(battle);
        });
    });
});

router.post('/:pid/:uid/move/:x/:y', function(req, res, next) {
    fs.readFile('./data/battle.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now       
        var result = battleLogic.processMove(
            JSON.parse(data), 
            req.params.pid, 
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.writeFile("./data/battle.json", JSON.stringify(result.battle), function(err) {
                if (err) throw err; // we'll not consider error handling for now
                res.json({
                    currUnit: result.unit, 
                    nextUnit: result.nextUnit,
                    targetUnit: result.targetUnit,
                    unitQueue: result.unitQueue
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
        var result = battleLogic.processAttack(
            JSON.parse(data), 
            req.params.pid, 
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.writeFile("./data/battle.json", JSON.stringify(result.battle), function(err) {
                if (err) throw err; // we'll not consider error handling for now
                res.json({
                    currUnit: result.unit, 
                    nextUnit: result.nextUnit,
                    targetUnit: result.targetUnit,
                    unitQueue: result.unitQueue
                });
            });
        }
        else{
            res.status(403);
        }
    });
});

module.exports = router;