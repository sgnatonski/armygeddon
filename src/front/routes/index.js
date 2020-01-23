var express = require('express');
var router = express.Router();
var cote = require('cote');

var playerRequester = new cote.Requester({
  name: 'player requester',
  namespace: 'player'
});
var battleTrackerRequester = new cote.Requester({
  name: 'battle tracker requester',
  namespace: 'battle_tracker'
});

router.get('/ranking', async (req, res, next) => {
  var ranking = await playerRequester.send({ type: 'getRanking' });
  res.json(ranking);
});

router.get('/open', async (req, res, next) => {
  var battles = await battleTrackerRequester.send({ type: 'getOpen' });
  res.json(battles);
});

module.exports = router;
