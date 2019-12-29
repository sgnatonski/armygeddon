var cote = require('cote');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var validateRegistration = require('../logic/registration_validator');
var storage = require('../storage/arango/arango_storage');
var users = storage.users;
var token_secret = process.env.TOKEN_SECRET;
var log = require('../logger');

var registerResponder = new cote.Responder({
    name: 'register responder',
    namespace: 'register',
    respondsTo: ['register']
});

var armyRequester = new cote.Requester({
    name: 'army requester',
    namespace: 'army'
});

registerResponder.on('*', console.log);

registerResponder.on('register', async req => {
    var validation = await validateRegistration(req.user);
    if (!validation.ok) {
        var err = new Error(validation.error);
        err.status = 400;
        throw err;
    }

    var userId = crypto.randomBytes(8).toString("hex");
    var hashedPassword = await bcrypt.hash(req.user.password, 8);

    try {
        var tiles = await armyRequester.send(({ type: 'create', userId: userId }));

        var user = {
            id: userId,
            name: req.user.name,
            mail: req.user.mail,
            pwdHash: hashedPassword,
            created: new Date().toISOString(),
            area: {
                name: `Area of ${req.user.name}`,
                tiles: tiles
            }
        };

        await users.store(user);

        var token = jwt.sign({ id: userId, name: user.name }, token_secret, {
            expiresIn: 86400000 // expires in 24 hours
        });
        return token;
    } catch (error) {
        log.error(error);
        throw error;
    }
});