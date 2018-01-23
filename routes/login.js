var express = require('express');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var router = express.Router();
var jwt = require('jsonwebtoken');

var users = [];

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'} );
});

router.post('/', function(req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  var user = users.find(u => u.pwdHash == hashedPassword);
  if (!user){
    var err = new Error('User not found');
    err.status = 401;
    next(err);
    return;
  }
  
  var token = jwt.sign({ id: user._id }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ auth: true, token: token });  
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'} );
});

router.post('/register', function(req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  var user = {
    id: crypto.randomBytes(8).toString("hex"),
    name: req.body.name,
    pwdHash: hashedPassword
  };

  users.push(user);
  
  var token = jwt.sign({ id: user.id }, req.app.get('TOKEN_SECRET'), {
    expiresIn: 86400 // expires in 24 hours
  });

  res.cookie('a_token', token, { maxAge: 86400, httpOnly: true });
  res.redirect('/');
});

module.exports = router;
