var cote = require('cote');
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var util =  require('util');
var aql = require("arangojs").aql;
var validateRegistration = require('@internal/common/logic/registration_validator');
var storage = require('@internal/common/storage/arango/arango_storage');
var log = require('@internal/common/logger');

var players = [];

var lastFetch = new Date().setMinutes(-30);

var responder = new cote.Responder({
    name: 'player responder',
    namespace: 'player',
    respondsTo: ['login', 'register', 'getRanking']
});

var armyRequester = new cote.Requester({
    name: 'army requester',
    namespace: 'army'
});

var rulesetRequester = new cote.Requester({
    name: 'ruleset requester',
    namespace: 'ruleset'
});

responder.on('*', console.log);

responder.on('login', async req => {
    try {
        if (!req.user.password || !req.user.name) {
            return null;
        }
        var user = await storage.users.getBy('name', req.user.name);
        if (!user) {
            user = await storage.users.getBy('mail', req.user.name);
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

responder.on('register', async req => {
    var validation = await validateRegistration(req.user);
    if (!validation.ok) {
        var err = new Error(validation.error);
        err.status = 422;
        throw err;
    }

    try {
        var userId = crypto.randomBytes(8).toString("hex");
        
        await rulesetRequester.send({ type: 'calculatePlayer', userId: userId });
        await armyRequester.send({ type: 'create', userId: userId, userName: req.user.name });

        var user = {
            id: userId,
            name: req.user.name,
            mail: req.user.mail,
            pwdHash: await bcrypt.hash(req.user.password, 8),
            created: new Date().toISOString()
        };

        await storage.users.store(user);

        return user;
    } catch (error) {
        log.error(error);
        throw error;
    }
});

responder.on('getRanking', async () => {
    if (lastFetch >= new Date().setMinutes(-30)){
        return players;
    }

    try {
        const cursor = await storage.query(aql`
        FOR u IN users
        FOR a IN armies
        FILTER a.playerId == u._key
        COLLECT playerName = u.name, expSum = SUM(a.units[*].experience), rankAvg = AVG(a.units[*].rank) 
        SORT expSum DESC, rankAvg DESC
        RETURN {
            "playerName" : playerName,
            "totalExp" : expSum,
            "totalRank" : rankAvg
        }
        `);
        players = await cursor.all();
        lastFetch = new Date();
        return players;
    } catch (error) {
        log.error(error);
        throw Error(error.message);
    }
});