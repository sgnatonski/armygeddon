var express = require('express');
var router = express.Router();
var cote = require('cote');

var requester = new cote.Requester({
  name: 'map requester',
  namespace: 'map'
});

router.get('/', async (req, res, next) => {
  try {
    var map = await requester.send({ type: 'get', userId: req.user.id });
    res.json(map);
  } catch (error) {
    next(error);
  }
});

module.exports = router;