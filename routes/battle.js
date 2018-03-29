var express = require('express');
var router = express.Router();
var fs = require('../storage/file_storage');
var battleLogic = require('../logic/battle');

router.get('/', function(req, res, next) {
    res.render('battle', { title: 'Battle' } );
});

router.post('/start', async function(req, res, next) {
    var data = await fs.get('init.battle');
    var ut = await storage.battleTemplates.get('unittypes');
    var battle = battleLogic.init(data, req.user.id, undefined, ut);        
    await fs.store(`battle_${battle.id}`, battle)
    res.json(battle.id);
});

module.exports = router;