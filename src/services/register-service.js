var cote = require('cote');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var validateRegistration = require('@internal/common/logic/registration_validator');
var storage = require('@internal/common/storage/arango/arango_storage');
var users = storage.users;
var log = require('@internal/common/logger');

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

        return user;
    } catch (error) {
        log.error(error);
        throw error;
    }
});