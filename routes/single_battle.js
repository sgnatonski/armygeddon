var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');
var battleScope = require('../logic/battle_scope');

router.post('/join/:battleid?', async function(req, res, next) {
    var exists = await storage.battles.exists(req.params.battleid);
    if (exists){
        var data = await storage.battles.get(req.params.battleid)
        res.json(data);
    }
    else{
        var data = await storage.battleTemplates.get('battle.tiny_plains_1');
        var ut = await storage.battleTemplates.get('unittypes');
        var army = await storage.armies.getBy('playerId', req.user.id);
        var battle = battleScope(data, req.user.id, req.user.name).init(ut, army);
        var army2 = await storage.armies.getBy('playerId', req.user.id);
        army2.units.forEach(x => x.id = '_' + x.id);
        battleScope(data, '_' + req.user.id).join(army2);
        await storage.battles.store(battle);
        res.json(data);
    }
});

router.post('/:battleid/:uid/:cmd/:x/:y', async function(req, res, next) {
    var data = await storage.battles.get(req.params.battleid);
    var cmd = { cmd: req.params.cmd, uid: req.params.uid, x: parseInt(req.params.x), y: parseInt(req.params.y), single: true };
    var result = battleScope(data, [req.user.id, '_' + req.user.id], req.user.name).processCommand(cmd);
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