var express = require('express');
var router = express.Router();
var battleTracker = require('../logic/battle_tracker');
var playerRank = require('../logic/player_rank');
var timeago = require("timeago.js");

router.get('/', async function(req, res, next) {
  var ranking = await playerRank.getRanking();  
  res.render('index', { title: 'Armygeddon', ranking: ranking } );
});

router.get('/start', async function(req, res, next) {
  var open = await battleTracker.getOpen();
  var battles = open.map(x => { return { 
    id: x.id, 
    name: x.players.filter(p => p !== null).join(' vs '),
    players: x.players.filter(p => p !== null).length,
    created: timeago().format(x.created)
  } });
  var ranking = await playerRank.getRanking();  
  res.render('start', { title: 'Armygeddon', battles: battles, ranking: ranking } );
});

module.exports = router;
