var express = require('express');
var router = express.Router();
var cote = require('cote');

var requester = new cote.Requester({
  name: 'design requester',
  namespace: 'design'
});

router.get('/', function (req, res, next) {
  res.render('design', { title: 'Design battle' });
});

router.post('/save', async function (req, res, next) {
  try {
    await requester.send({ type: 'create', name: req.body.name, terrain: req.body.terrain });
    res.json(true);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
