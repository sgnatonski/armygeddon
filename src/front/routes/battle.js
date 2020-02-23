var express = require('express');
var router = express.Router();
var cote = require('cote');

var battleRequester = new cote.Requester({
    name: 'battle requester',
    namespace: 'battle'
});

var battleTrackerRequester = new cote.Requester({
    name: 'battle tracker requester',
    namespace: 'battle_tracker'
});

router.get('/open', async (req, res, next) => {
    try {
        var battles = await battleTrackerRequester.send({ type: 'getOpen' });
    res.json(battles);
    } catch (error) {
        next(error);
    }
});

router.post('/battle/start', async (req, res, next) => {
    try {
        var battleId = await battleRequester.send({ type: 'start', playerId: req.user.id, name: req.user.name });
        res.json(battleId);
    } catch (error) {
        next(error);
    }
});

module.exports = router;