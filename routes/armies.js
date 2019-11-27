var express = require('express');
var router = express.Router();
var cote = require('cote');

var armyRequester = new cote.Requester({
  name: 'army requester',
  namespace: 'army'
});

router.get('/', async (req, res, next) => {
  try {
    var armies = await armyRequester.send({ type: 'armies', playerId: req.user.id });
    res.render('armies', { title: 'Armies', armies: armies });
  } catch (error) {
    next(error);
  }
});

module.exports = router;