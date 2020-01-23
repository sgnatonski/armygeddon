var express = require('express');
var cote = require('cote');

var loginRequester = new cote.Requester({
  name: 'login requester',
  namespace: 'login'
});

var registerRequester = new cote.Requester({
  name: 'register requester',
  namespace: 'register'
});

var router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    var token = await loginRequester.send({ type: 'login', user: req.body });
    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.json({ name: 'test' });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    var token = await registerRequester.send({ type: 'register', user: req.body });
    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.json({ name: 'test' });
  } catch (error) {    
    next(error); 
  }
});

module.exports = router;