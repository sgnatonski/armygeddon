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
  var user = await users.getBy('name', req.body.name);
  if (!user || !await bcrypt.compare(req.body.password, user.pwdHash)){
    var err = new Error('User not found');
    err.status = 401;
    next(err);
    return;
  }
  
  var token = jwt.sign({ id: user._key }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400000 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'} );
});

router.post('/register', async function(req, res, next) {
  var hashedPassword = await bcrypt.hash(req.body.password, 8);

  var user = {
    _key: crypto.randomBytes(8).toString("hex"),
    name: req.body.name,
    pwdHash: hashedPassword
  };

  var existing = await users.getBy('name', user.name);
  if (existing){
    var err = new Error('User name conflict');
    err.status = 400;
    next(err);
    return;
  }

  await users.store(user);

  var army = await storage.battleTemplates.get('army.default');
  delete army._key;
  delete army._id;
  delete army._rev;

  army.playerId = user._key;
  army.units = army.units.map(u => Object.assign({id: crypto.randomBytes(8).toString("hex")}, u));

  await storage.armies.store(army);

  var token = jwt.sign({ id: user._key }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400000 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
  res.redirect('/');
});

module.exports = router;