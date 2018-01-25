var express = require('express');
var router = express.Router();
var fs = require('../storage/file_storage');
var battleLogic = require('../logic/battle');

router.post('/join/:battleid?', function(req, res, next) {
    fs.exists(`battle_${req.params.battleid}`).then(exists => {
        if (exists){
            fs.get(`battle_${req.params.battleid}`)
                .then(data => res.json(data));
        }
        else{
            fs.get('init.battle').then(data => {
                var battle = battleLogic.init(data, req.user.id, req.params.battleid);
                battleLogic.join(battle, req.user.id2);
    
                fs.store(`battle_${battle.id}`, battle)
                    .then(result => res.json(data));
            });
        }
    });
});

router.post('/:battleid/:uid/move/:x/:y', function(req, res, next) {
    fs.get(`battle_${req.params.battleid}`).then(data => {
        var result = battleLogic.processMove(
            data, 
            [req.user.id, req.user.id2],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.store(`battle_${result.battle.id}`, result.battle).then(data => {
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
    fs.get(`battle_${req.params.battleid}`).then(data => {     
        var result = battleLogic.processTurn(
            data, 
            [req.user.id, req.user.id2],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.store(`battle_${result.battle.id}`, result.battle).then(data => {
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
    fs.get(`battle_${req.params.battleid}`).then(data => {
        var result = battleLogic.processAttack(
            data, 
            [req.user.id, req.user.id2],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            fs.store(`battle_${result.battle.id}`, result.battle).then(data => {
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