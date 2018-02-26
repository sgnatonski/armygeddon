var express = require('express');
var router = express.Router();
var battleTracker = require('../battle_tracker');

/* GET home page. */
router.get('/', function(req, res, next) {
  var open = battleTracker.getOpen().map(id => { return { name: id } });
  res.render('index', { title: 'Start', battles: open } );
});

router.get('/single', function(req, res, next) {
  res.render('single', { title: 'Single battle' } );
});

module.exports = router;
