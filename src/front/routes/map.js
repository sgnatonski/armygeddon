var express = require('express');
var router = express.Router();
var cote = require('cote');

var cfg = require( "../../common/mapgen/core/config");
var generate_points = require("../../common/mapgen/core/generate-points");

var requester = new cote.Requester({
  name: 'map requester',
  namespace: 'map'
});

router.get('/', async (req, res, next) => {
  try {
    //var map = await requester.send({ type: 'get', userId: req.user.id });

    var points = generate_points(cfg);

    res.json(points);
  } catch (error) {
    next(error);
  }
});

module.exports = router;