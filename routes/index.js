var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Battle' } );
});

router.get('/start', function(req, res, next) {
  res.render('start', { title: 'Start'} );
});

router.get('/single', function(req, res, next) {
  res.render('single', { title: 'Single battle' } );
});

module.exports = router;
