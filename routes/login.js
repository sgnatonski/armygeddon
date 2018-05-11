var express = require('express');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var validateRegistration = require('../logic/registration_validator');
var armyCreate = require('../logic/army_creator');
var storage = require('../storage/arango/arango_storage');
var users = storage.users;

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'} );
});

router.post('/', async function(req, res, next) {
  var user = await users.getBy('name', req.body.name);
  if (!user){
    user = await users.getBy('mail', req.body.name);
  }
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
  var validation = await validateRegistration(req.body);
  if (!validation.ok){
    var err = new Error(validation.error);
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

  await users.store(user);
  await armyCreate(user.id);

  var token = jwt.sign({ id: user.id, name: user.name }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400000 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
  res.redirect('/start');
});

module.exports = router;