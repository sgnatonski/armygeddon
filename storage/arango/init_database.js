var arangojs = require("arangojs");
var faker = require('faker');

async function ensureDbExists(db, dbname) {
    var names = await db.listDatabases();
    if (!names.some(n => n == dbname)) {
        await db.createDatabase(dbname);
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
            await inits.save({
                _key: "unittypes",
                "inf": {
                    "mobility": 2,
                    "agility": 2,
                    "damage": 3,
                    "maxDirections": 3,
                    "armor": 1,
                    "attacks": 1,
                    "speed": 1,
                    "range": 1,
                    "charge": 0,
                    "lifetime": {
                        "endurance": 12,
                        "mobility": 2,
                        "agility": 2
                    }
                },
                "arch": {
                    "mobility": 2,
                    "agility": 0,
                    "damage": 5,
                    "maxDirections": 1,
                    "armor": 0,
                    "attacks": 1,
                    "speed": 1,
                    "range": 3,
                    "charge": 0,
                    "lifetime": {
                        "endurance": 8,
                        "mobility": 2,
                        "agility": 0
                    }
                },
                "cav": {
                    "mobility": 3,
                    "agility": 1,
                    "damage": 3,
                    "maxDirections": 1,
                    "armor": 2,
                    "attacks": 1,
                    "speed": 3,
                    "range": 1,
                    "charge": 0,
                    "lifetime": {
                        "endurance": 15,
                        "mobility": 3,
                        "agility": 1
                    }
                }
            });
        }
        else throw err;
    }

    try {
        await inits.document('army.default');
    }
    catch (err) {
        if (err.code == 404) {
            await inits.save({
                _key: "army.default",
                "units": [
                    { type: 'inf' },
                    { type: 'inf' },
                    { type: 'arch' },
                    { type: 'cav' }
                ]
            });
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
    if (process.env.ARANGO_INIT) {
        await ensureDbExists(db, dbname);
        db.useDatabase(dbname);
        await ensureCollectionExists(db, 'battles');
        await ensureCollectionExists(db, 'users');
        await ensureCollectionExists(db, 'armies');
        await ensureCollectionExists(db, 'inits');
        await ensureCollectionExists(db, 'map');
        await createInitData(db);
        if (process.env.FAKER_SEED) {
            //await createRandomData(db);
        }
    }

    return db;
};

module.exports = init();