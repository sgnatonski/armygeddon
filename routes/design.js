var express = require('express');
var router = express.Router();
var tmpl = require('../storage/arango/arango_storage').battleTemplates;

router.get('/', function(req, res, next) {
  res.render('design', { title: 'Design battle' });
});

router.post('/save', async function(req, res, next) {
  var t = {
    _key: 'battle.' + req.body.name,
    terrain: req.body.terrain
  };
  await tmpl.store(t);
  res.json(true);
});

module.exports = router;
