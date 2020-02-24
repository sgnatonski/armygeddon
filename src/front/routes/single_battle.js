var express = require('express');
var router = express.Router();
var cote = require('cote');

var battleRequester = new cote.Requester({
    name: 'battle requester',
    namespace: 'battle'
});

router.post('/join/:battleid?', async (req, res, next) => {
    try {
        if (req.params.battleid) {
            var battle = await battleRequester.send({ type: 'get', battleId: req.params.battleid });
            if (battle) {
                res.json(battle);
                return;
            }
        }

        var battleId = await battleRequester.send({ type: 'start', playerId: req.user.id, name: req.user.name, mode: 'single' });
        var battle = await battleRequester.send({ type: 'selfjoin', battleId: battleId, playerId: req.user.id, name: req.user.name });
        res.json(battle);
    } catch (error) {
        next(error);
    }
});

router.post('/:battleid/:uid/:cmd/:x/:y', async (req, res, next) => {
    try {
        var cmd = { cmd: req.params.cmd, uid: req.params.uid, x: parseInt(req.params.x), y: parseInt(req.params.y) };
        var result = await battleRequester.send({ type: 'process', battleId: req.params.battleid, playerId: req.user.id, name: req.user.name, cmd: cmd });
        if (result.success) {
            if (result.ended) {
                res.json({
                    event: 'end',
                    battle: result.battle
                });
            }
            else{
                res.json({
                    event: 'update',
                    currUnit: result.unit,
                    nextUnit: result.nextUnit,
                    targetUnit: result.targetUnit,
                    unitQueue: result.unitQueue
                });
            }
        }
        else {
            res.status(403);
        }
    } catch (error) {
        next(error);
    }

});

module.exports = router;