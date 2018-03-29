var fs = require('fs');
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
    await inits.truncate();
    var data = await fs.readFileSync(`./data/init.battle.json`, 'utf8');    
    var i = JSON.parse(data);
    i._key = 'battle';
    await inits.save(i);
}

var dbname = process.env.ARANGO_DB;
var db = new arangojs.Database({
    url: process.env.ARANGO_URL
}).useBasicAuth(
    process.env.ARANGO_USER, 
    process.env.ARANGO_PASS
);    

(async function() {
    await ensureDbExists(db, dbname);
    db.useDatabase(dbname);
    await ensureCollectionExists(db, 'battles');
    await ensureCollectionExists(db, 'users');
    await ensureCollectionExists(db, 'inits');
    await createInitData(db);
})();

module.exports = db;