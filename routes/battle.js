var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');
var battleScope = require('../logic/battle_scope');
var battleTracker = require('../logic/battle_tracker');

function battle(prod){
    return function battle(req, res, next) {
        res.render('battle', { title: 'Battle', prod: prod } );
    }
}

async function start(req, res, next) {
    var data = await storage.battleTemplates.get('battle.plains_forest_1');
    var ut = await storage.battleTemplates.get('unittypes');
    var army = await storage.armies.getBy('playerId', req.user.id);
    var battle = battleScope(data, req.user.id, req.user.name).init(ut, army);
    await storage.battles.store(battle);
    battleTracker.addOpen(battle.id, [req.user.id]);
    res.json(battle.id);
}

module.exports = {
    dev: () => {
        router.get('/', battle(false));
        router.post('/start', start);
        return router;
    },
    prod: () => {
        router.get('/', battle(true));
        router.post('/start', start);
        return router;
    }
};