var express = require('express');
var router = express.Router();
var cote = require('cote');

var requester = new cote.Requester({
  name: 'map requester',
  namespace: 'map'
});

router.get('/', async function(req, res, next) {    
    var map = await requester.send({ type: 'get' });
    res.render('map', { title: 'Map', map: map } );
  });
  
  module.exports = router;