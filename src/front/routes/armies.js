var express = require('express');
var router = express.Router();
var cote = require('cote');

var armyRequester = new cote.Requester({
  name: 'army requester',
  namespace: 'army'
});

var patternRequester = new cote.Requester({
  name: 'pattern requester',
  namespace: 'pattern'
});

var patternPublisher = new cote.Publisher({
  name: 'pattern publisher',
  namespace: 'pattern',
  broadcasts: ['train'],
});

router.get('/', async (req, res, next) => {
  try {
    var armies = await armyRequester.send({ type: 'armies', playerId: req.user.id });
    res.json(armies);
  } catch (error) {
    next(error);
  }
});

router.get('/trainarmytypes', async (req, res, next) => {
  try {
    patternPublisher.publish('train', 'armytypes');
    res.json(null);
  } catch (error) {
    next(error);
  }
});

router.post('/matchunit', async (req, res, next) => {
  try {
    var result = await patternRequester.send({ type: 'getMatchingUnitPattern', pattern: req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;