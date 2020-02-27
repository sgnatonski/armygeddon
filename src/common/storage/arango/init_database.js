var arangojs = require("arangojs");
var log = require('../../logger');

async function ensureDbExists(db, dbname) {
    var names = await db.listDatabases();
    if (!names.some(n => n == dbname)) {
        try {
            await db.createDatabase(dbname);
        } catch (error) {
            log.error(error);
        }
    }
}

async function ensureCollectionExists(db, colname) {
    var cols = await db.collections();
    if (!cols.some(n => n.name == colname)) {
        await db.collection(colname).create();
    }
}

async function createInitData(db) {
    var inits = db.collection('inits');
    try {
        await inits.document('unittypes');
    }
    catch (err) {
        if (err.code == 404) {
            var unittypes = require("../../../data/init.unittypes.json");            
            await inits.save(unittypes);
        }
        else throw err;
    }

    try {
        await inits.document('army.default');
    }
    catch (err) {
        if (err.code == 404) {
            var army = require("../../../data/init.army.json");
            await inits.save(army);
        }
        else throw err;
    }

    try {
        await inits.document('battle.default');
    }
    catch (err) {
        if (err.code == 404) {
            var battle = require("../../../data/init.battle.json")
            await inits.save(battle);
        }
        else throw err;
    }
}

//var armyCreate = require('../../logic/army_creator');
//var mapRegistry = require('../../logic/map_registry');
//var bcrypt = require("bcryptjs");

async function createRandomData(db) {
    faker.seed(Number(process.env.FAKER_SEED));

    var users = db.collection('users');
    for (var i = 0; i < 100000; i++) {
        var userId = faker.random.uuid().replace(/-/g, '').substr(0, 16); // crypto.randomBytes(8).toString("hex");
        var hashedPassword = await bcrypt.hash(faker.internet.password(), 8);
        var username = faker.name.findName();

        await armyCreate(userId);
        var tiles = await mapRegistry.assignNewArea(userId);

        var user = {
            id: userId,
            name: username,
            mail: faker.internet.email(),
            pwdHash: hashedPassword,
            created: new Date().toISOString(),
            area: {
                name: `Area of ${username}`,
                tiles: tiles
            }
        };

        await users.store(user);
    }
}

async function init() {
    var dbname = process.env.ARANGO_DB;
    var db = new arangojs.Database({
        url: process.env.ARANGO_URL
    }).useBasicAuth(
        process.env.ARANGO_USER,
        process.env.ARANGO_PASS
    );
    await ensureDbExists(db, dbname);
    db.useDatabase(dbname);
    if (process.env.ARANGO_INIT) {
        await ensureCollectionExists(db, 'battles');
        await ensureCollectionExists(db, 'users');
        await ensureCollectionExists(db, 'armies');
        await ensureCollectionExists(db, 'inits');
        await ensureCollectionExists(db, 'map');
        await ensureCollectionExists(db, 'models');
        await ensureCollectionExists(db, 'rulesets');
        await createInitData(db);
        if (process.env.FAKER_SEED) {
            //await createRandomData(db);
        }
    }

    return db;
};

module.exports = init;