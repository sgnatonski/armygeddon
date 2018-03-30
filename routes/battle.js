var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');
var battleLogic = require('../logic/battle');
var battleTracker = require('../logic/battle_tracker');

router.get('/', function(req, res, next) {
    res.render('battle', { title: 'Battle' } );
});

router.post('/start', async function(req, res, next) {
    var data = await storage.battleTemplates.get('battle.plains_forest_1');
    var ut = await storage.battleTemplates.get('unittypes');
    var army = await storage.armies.getBy('playerId', req.user.id);
    var battle = battleLogic.init(data, req.user.id, undefined, ut, army);
    await storage.battles.store(battle);
    battleTracker.addOpen(battle.id, [req.user.id]);
    res.json(battle.id);
});

module.exports = router;