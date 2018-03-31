var arangojs = require("arangojs");

async function ensureDbExists(db, dbname){
    var names = await db.listDatabases();
    if (!names.some(n => n == dbname)){
        await db.createDatabase(dbname);
    }
}

async function ensureCollectionExists(db, colname){
    var cols = await db.collections();
    if (!cols.some(n => n.name == colname)){
        await db.collection(colname).create();
    }    
}

async function createInitData(db) {
    var inits = db.collection('inits');
    try {    
        await inits.document('unittypes');
    }
    catch(err) {
        if (err.code == 404){
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
                  "lifetime":{
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
                  "lifetime":{
                    "endurance": 8,
                    "mobility": 2,
                    "agility": 0
                  }
                },
                "cav":{
                  "mobility": 3,
                  "agility": 1,
                  "damage": 3,
                  "maxDirections": 1,
                  "armor": 2,
                  "attacks": 1,
                  "speed": 3,
                  "range": 1,
                  "charge": 0 ,
                  "lifetime":{
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
    catch(err) {
        if (err.code == 404){
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

var db;

async function init () {
    var dbname = process.env.ARANGO_DB;
    db = new arangojs.Database({
        url: process.env.ARANGO_URL
    }).useBasicAuth(
        process.env.ARANGO_USER, 
        process.env.ARANGO_PASS
    );
    await ensureDbExists(db, dbname);
    db.useDatabase(dbname);
    await ensureCollectionExists(db, 'battles');
    await ensureCollectionExists(db, 'users');
    await ensureCollectionExists(db, 'armies');
    await ensureCollectionExists(db, 'inits');
    await createInitData(db);
    return db;
};

module.exports = init();