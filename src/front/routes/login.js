var express = require('express');
var router = express.Router();
var cote = require('cote');
var jwt = require('jsonwebtoken');
var token_secret = process.env.TOKEN_SECRET;

var playerRequester = new cote.Requester({
  name: 'player requester',
  namespace: 'player'
});

router.post('/login', async (req, res, next) => {
  try {
    var user = await playerRequester.send({ type: 'login', user: req.body });
    if (!user) {
      var err = new Error('User not found'); 
      err.status = 401;
      throw err;
    }

    var token = jwt.sign({ id: user.id, name: user.name }, token_secret, {
      expiresIn: 86400000 // expires in 24 hours
    });

    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.json({ name: req.body.name });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await playerRequester.send({ type: 'register', user: req.body });

    var token = jwt.sign({ id: user.id, name: user.name }, token_secret, {
      expiresIn: 86400000 // expires in 24 hours
    });

    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.json({ name: req.body.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;