var cote = require('cote');
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var storage = require('../storage/arango/arango_storage');
var users = storage.users;
var token_secret = process.env.TOKEN_SECRET;

var loginResponder = new cote.Responder({
    name: 'login responder',
    namespace: 'login',
    respondsTo: ['login']
});

loginResponder.on('*', console.log);

loginResponder.on('login', async req => {
    if (!req.user.password || !req.user.name){
        var err = new Error('User not found');
        err.status = 401;
        throw err;
    }
    var user = await users.getBy('name', req.user.name);
    if (!user) {
        user = await users.getBy('mail', req.user.name);
    }
    if (!user || !await bcrypt.compare(req.user.password, user.pwdHash)) {
        var err = new Error('User not found');
        err.status = 401;
        throw err;
    }

    var token = jwt.sign({ id: user.id, name: user.name }, token_secret, {
        expiresIn: 86400000 // expires in 24 hours
    });
    return token;
});