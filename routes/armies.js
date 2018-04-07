var express = require('express');
var router = express.Router();
var storage = require('../storage/arango/arango_storage');

router.get('/', async function(req, res, next) {    
    var armies = await storage.armies.getAllBy('playerId', req.user.id);
    res.render('armies', { title: 'Armies', armies: armies } );
  });
  
  module.exports = router;