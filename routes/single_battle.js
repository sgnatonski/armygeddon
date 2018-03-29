var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');
var battleLogic = require('../logic/battle');

router.post('/join/:battleid?', async function(req, res, next) {
    var exists = await storage.battles.exists(req.params.battleid);
    if (exists){
        var data = await storage.battles.get(req.params.battleid)
        res.json(data);
    }
    else{
        var data = await storage.battleTemplates.get('battle');
        var ut = await storage.battleTemplates.get('unittypes');
        var battle = battleLogic.init(data, req.user.id, req.params.battleid, ut);
        battleLogic.join(battle, '_' + req.user.id);

        battle._key = battle.id;
        await storage.battles.store(battle);
        res.json(data);
    }
});

router.post('/:battleid/:uid/move/:x/:y', async function(req, res, next) {
    var data = await storage.battles.get(req.params.battleid);
    var result = battleLogic.processMove(
        data, 
        [req.user.id, '_' + req.user.id],
        req.params.uid, 
        parseInt(req.params.x), 
        parseInt(req.params.y)
    );
    if (result.success){
        await storage.battles.store(result.battle);
        res.json({
            currUnit: result.unit, 
            nextUnit: result.nextUnit,
            targetUnit: result.targetUnit,
            unitQueue: result.unitQueue
        });
    }
    else{
        res.status(403);
    }
});

router.post('/:battleid/:uid/turn/:x/:y', async function(req, res, next) {
    var data = await storage.battles.get(req.params.battleid);
    var result = battleLogic.processTurn(
        data, 
        [req.user.id, '_' + req.user.id],
        req.params.uid, 
        parseInt(req.params.x), 
        parseInt(req.params.y)
    );
    if (result.success){
        await storage.battles.store(result.battle);
        res.json({
            currUnit: result.unit, 
            nextUnit: result.nextUnit,
            targetUnit: result.targetUnit,
            unitQueue: result.unitQueue
        });
    }
    else{
        res.status(403);
    }
});

router.post('/:battleid/:uid/attack/:x/:y', async function(req, res, next) {
    var data = await storage.battles.get(req.params.battleid);
    var result = battleLogic.processAttack(
        data, 
        [req.user.id, '_' + req.user.id],
        req.params.uid, 
        parseInt(req.params.x), 
        parseInt(req.params.y)
    );
    if (result.success){
        await storage.battles.store(result.battle);
        res.json({
            currUnit: result.unit, 
            nextUnit: result.nextUnit,
            targetUnit: result.targetUnit,
            unitQueue: result.unitQueue
        });
    }
    else{
        res.status(403);
    }
});

module.exports = router;