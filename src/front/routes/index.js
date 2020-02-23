var express = require('express');
var router = express.Router();
var cote = require('cote');

var playerRequester = new cote.Requester({
  name: 'player requester',
  namespace: 'player'
});

router.get('/ranking', async (req, res, next) => {
  var ranking = await playerRequester.send({ type: 'getRanking' });
  res.json(ranking);
});

module.exports = router;
