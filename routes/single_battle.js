var express = require('express');
var router = express.Router();
var storage = require('../storage/arango_storage');
var battleLogic = require('../logic/battle');

router.post('/join/:battleid?', function(req, res, next) {
    storage.battles.exists(req.params.battleid).then(exists => {
        if (exists){
            storage.battles.get(req.params.battleid)
                .then(data => res.json(data));
        }
        else{
            storage.battleTemplates.get('battle').then(data => {
                var battle = battleLogic.init(data, req.user.id, req.params.battleid);
                battleLogic.join(battle, '_' + req.user.id);
    
                battle._key = battle.id;
                storage.battles.store(battle)
                    .then(result => res.json(data));
            });
        }
    });
});

router.post('/:battleid/:uid/move/:x/:y', function(req, res, next) {
    storage.battles.get(req.params.battleid).then(data => {
        var result = battleLogic.processMove(
            data, 
            [req.user.id, '_' + req.user.id],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            storage.battles.store(result.battle).then(data => {
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
    storage.battles.get(req.params.battleid).then(data => {     
        var result = battleLogic.processTurn(
            data, 
            [req.user.id, '_' + req.user.id],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            storage.battles.store(result.battle).then(data => {
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
    storage.battles.get(req.params.battleid).then(data => {
        var result = battleLogic.processAttack(
            data, 
            [req.user.id, '_' + req.user.id],
            req.params.uid, 
            parseInt(req.params.x), 
            parseInt(req.params.y)
        );
        if (result.success){
            storage.battles.store(result.battle).then(data => {
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