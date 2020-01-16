var express = require('express');
var router = express.Router();
var cote = require('cote');

var requester = new cote.Requester({
  name: 'battle template requester',
  namespace: 'battle_template'
});

router.get('/', async (req, res, next) => {
  try {
    var battleList = await requester.send({ type: 'list' });
    res.render('design', { title: 'Design battle', battles: battleList });
  } catch (error) {
    next(error);
  }
});

router.post('/save', async (req, res, next) => {
  try {
    await requester.send({ type: 'create', name: req.body.name, terrain: req.body.terrain });
    res.json(true);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
