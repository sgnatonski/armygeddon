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

router.get('/', async function(req, res, next) {
  var ranking = await playerRequester.send({ type: 'getRanking' });
  res.render('index', { title: 'Armygeddon', ranking: ranking } );
});

router.get('/start', async (req, res, next) => {
  var battles = await battleTrackerRequester.send({ type: 'getOpen' });
  var ranking = await playerRequester.send({ type: 'getRanking' });
  res.render('start', { title: 'Armygeddon', battles: battles, ranking: ranking } );
});

module.exports = router;
