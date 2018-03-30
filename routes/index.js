var express = require('express');
var router = express.Router();
var battleTracker = require('../logic/battle_tracker');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var open = await battleTracker.getOpen();
  var battles = open.map(x => { return { name: x.id, players: x.players.length } });
  res.render('index', { title: 'Armygeddon', battles: battles } );
});

module.exports = router;
