var express = require('express');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var storage = require('../storage/arango/arango_storage');
var users = storage.users;

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'} );
});

router.post('/', async function(req, res, next) {
  var userByName = await users.getBy('name', req.body.name);
  var userByMail = await users.getBy('mail', req.body.name);
  var user = userByMail || userByName;
  if (!user || !await bcrypt.compare(req.body.password, user.pwdHash)){
    var err = new Error('User not found');
    err.status = 401;
    next(err);
    return;
  }
  
  var token = jwt.sign({ id: user.id, name: user.name }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400000 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
  res.redirect('/start');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'} );
});

router.post('/register', async function(req, res, next) {
  if (req.body.password !== req.body.confirm){
    var err = new Error('Passwords does not match');
    err.status = 400;
    next(err);
    return;
  }

  if (!req.body.name || req.body.name.length < 6){
    var err = new Error('Username must have at least 6 characters');
    err.status = 400;
    next(err);
    return;
  }

  if (!req.body.mail || req.body.mail < 6){
    var err = new Error('Email is required');
    err.status = 400;
    next(err);
    return;
  }

  var hashedPassword = await bcrypt.hash(req.body.password, 8);

  var user = {
    id: crypto.randomBytes(8).toString("hex"),
    name: req.body.name,
    mail: req.body.mail,
    pwdHash: hashedPassword,
    created: new Date().toISOString()
  };

  var existing = await users.getBy('name', user.name);
  if (existing){
    var err = new Error('User name conflict');
    err.status = 400;
    next(err);
    return;
  }
  else{
    existing = await users.getBy('mail', user.mail);
    if (existing){
      var err = new Error('Email conflict');
      err.status = 400;
      next(err);
      return;
    }
  }

  await users.store(user);

  var army = await storage.battleTemplates.get('army.default');

  army.playerId = user.id;
  army.id = crypto.randomBytes(8).toString("hex");
  army.name = 'default';
  army.units = army.units.map(u => Object.assign({
    id: crypto.randomBytes(8).toString("hex"),
    experience: 0,
    rank: 0
  }, u));

  await storage.armies.store(army);

  var token = jwt.sign({ id: user.id, name: user.name }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400000 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
  res.redirect('/start');
});

module.exports = router;