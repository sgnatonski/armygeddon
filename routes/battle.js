var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');
var battleLogic = require('../logic/battle');

router.get('/', function(req, res, next) {
    res.render('battle', { title: 'Battle' } );
});

router.post('/start', async function(req, res, next) {
    var data = await storage.battleTemplates.get('battle.small_lakes_1');
    var ut = await storage.battleTemplates.get('unittypes');
    var army = await storage.armies.getBy('playerId', req.user.id);
    var battle = battleLogic.init(data, req.user.id, undefined, ut, army);        
    battle._key = battle.id;
    await storage.battles.store(battle)
    res.json(battle.id);
});

module.exports = router;