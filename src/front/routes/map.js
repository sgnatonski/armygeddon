var express = require('express');
var router = express.Router();
var storage = require('@internal/common/storage/arango/arango_storage');

router.get('/', async function(req, res, next) {    
    var map = await storage.map.get('map');
    res.render('map', { title: 'Map', map: map } );
  });
  
  module.exports = router;