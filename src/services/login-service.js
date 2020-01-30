var cote = require('cote');
var bcrypt = require("bcryptjs");
var storage = require('@internal/common/storage/arango/arango_storage');
var users = storage.users;

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

    return user;
});