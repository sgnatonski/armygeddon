var express = require('express');
var fs = require('fs');
var router = express.Router();
var battleLogic = require('../logic/battle');

router.post('/join/:battleid?', function(req, res, next) {
    fs.exists(`./data/battle_${req.params.battleid}.json`, function (exists) {
        if (exists){
            fs.readFile(`./data/battle_${req.params.battleid}.json`, 'utf8', function (err, data) {
                if (err) throw err; // we'll not consider error handling for now
                res.json(JSON.parse(data));
            });
        }
        else{
            fs.readFile('./data/init.battle.json', 'utf8', function (err, data) {
                if (err) throw err; // we'll not consider error handling for now
                var battle = battleLogic.init(JSON.parse(data), req.user.id, req.params.battleid);
    
                fs.writeFile(`./data/battle_${battle.id}.json`, JSON.stringify(battle), function(err) {
                    if (err) throw err; // we'll not consider error handling for now
                    res.json(battle);
                });
            });
        }
    });
});

router.post('/:battleid/:uid/move/:x/:y', function(req, res, next) {
    fs.readFile(`./data/battle_${req.params.battleid}.json`, 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now       
        var result = battleLogic.processMove(
            JSON.parse(data), 
            req.user.id, 
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.writeFile(`./data/battle_${req.params.battleid}.json`, JSON.stringify(result.battle), function(err) {
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

router.post('/:battleid/:uid/turn/:x/:y', function(req, res, next) {
    fs.readFile(`./data/battle_${req.params.battleid}.json`, 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now       
        var result = battleLogic.processTurn(
            JSON.parse(data), 
            req.user.id, 
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.writeFile(`./data/battle_${req.params.battleid}.json`, JSON.stringify(result.battle), function(err) {
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

router.post('/:battleid/:uid/attack/:x/:y', function(req, res, next) {
    fs.readFile(`./data/battle_${req.params.battleid}.json`, 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var result = battleLogic.processAttack(
            JSON.parse(data), 
            req.user.id, 
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.writeFile(`./data/battle_${req.params.battleid}.json`, JSON.stringify(result.battle), function(err) {
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