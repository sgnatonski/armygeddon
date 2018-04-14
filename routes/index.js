var express = require('express');
var router = express.Router();
var battleTracker = require('../logic/battle_tracker');
var timeago = require("timeago.js");

router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Armygeddon' } );
});

router.get('/start', async function(req, res, next) {
  var open = await battleTracker.getOpen();
  var battles = open.map(x => { return { 
    id: x.id, 
    name: x.players.filter(p => p !== null).join(' vs '),
    players: x.players.filter(p => p !== null).length,
    created: timeago().format(x.created)
  } });
  res.render('start', { title: 'Armygeddon', battles: battles } );
});

module.exports = router;
