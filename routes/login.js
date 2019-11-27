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

router.get('/', (req, res, next) => {
  res.render('login', { 
    title: 'Login', 
    error: req.query['noauth'] ? 'We couldn\'t recognize you, Sir. Please enter your credentials.' : undefined 
  });
});

router.post('/', async (req, res, next) => {
  try {
    var token = await loginRequester.send({ type: 'login', user: req.body });
    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.redirect('/start');
  } catch (error) {
    next(error);
  }
});

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res, next) => {
  try {
    var token = await registerRequester.send({ type: 'register', user: req.body });
    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.redirect('/start');
  } catch (error) {
    next(error);
  }
});

module.exports = router;