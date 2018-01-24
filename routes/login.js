var express = require('express');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var fs = require('fs');

var router = express.Router();

function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/users.json', 'utf8', function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });  
}

function storeUsers(users) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./data/users.json", JSON.stringify(users), function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });  
}

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login'} );
});

router.post('/', function(req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  getUsers().then(users => {
    var user = users.find(u => bcrypt.compareSync(req.body.password, u.pwdHash));
    if (!user){
      var err = new Error('User not found');
      err.status = 401;
      next(err);
      return;
    }
    
    var token = jwt.sign({ id: user.id }, req.app.get('TOKEN_SECRET'), {
      expiresIn: 86400000 // expires in 24 hours
    });

    res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
    res.redirect('/');
  });
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

  getUsers().then(users => {
    var existing = users.find(u => u.name == user.name);
    if (existing){
      var err = new Error('User name conflict');
      err.status = 400;
      next(err);
      return;
    }

    users.push(user);

    storeUsers(users).then(() => {
      var token = jwt.sign({ id: user.id }, req.app.get('TOKEN_SECRET'), {
        expiresIn: 86400000 // expires in 24 hours
      });
  
      res.cookie('a_token', token, { maxAge: 86400000, httpOnly: true });
      res.redirect('/');
    })
  });
});

module.exports = router;