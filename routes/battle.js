var express = require('express');
var router = express.Router();
var cote = require('cote');

var battleRequester = new cote.Requester({
    name: 'battle requester',
    namespace: 'battle'
});

function battle(prod) {
    return function battle(req, res, next) {
        res.render('battle', { title: 'Battle', prod: prod });
    }
}

async function start(req, res, next) {
    try {
        var battleId = await battleRequester.send({ type: 'start', playerId: req.user.id, name: req.user.name });
        res.json(battleId);
    } catch (error) {
        next(error);
    }
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