var cote = require('cote');
var bcrypt = require("bcryptjs");
var storage = require('@internal/common/storage/arango/arango_storage');
var users = storage.users;
var util =  require('util');

var loginResponder = new cote.Responder({
    name: 'login responder',
    namespace: 'login',
    respondsTo: ['login']
});

loginResponder.on('*', console.log);

loginResponder.on('login', async req => {
    try {
        if (!req.user.password || !req.user.name) {
            return null;
        }
        var user = await users.getBy('name', req.user.name);
        if (!user) {
            user = await users.getBy('mail', req.user.name);
        }
        if (!user || !await bcrypt.compare(req.user.password, user.pwdHash)) {
            return null;
        }

        return user;
    }
    catch (err) {
        throw util.inspect(err);
    }
});