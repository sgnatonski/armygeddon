var arangojs = require("arangojs");
var fs = require('fs');

function ensureDbExists(dbname){
    return new Promise((resolve, reject) =>{
        db.listDatabases().then(names => {
            if (!names.some(n => n == dbname)){
                db.createDatabase(dbname).then(info => {
                    resolve(db);
                });
            }
            else{
                resolve(db);
            }
        });
    });
}

function ensureCollectionExists(colname){
    return new Promise((resolve, reject) =>{
        db.collections().then(cols => {
            if (!cols.some(n => n.name == colname)){
                db.collection(colname).create().then(() => {
                    resolve(db);
                });
            }
            else{
                resolve(db);
            }
        });
    });
}

var dbname = process.env.ARANGO_DB;
var db = new arangojs.Database({
    url: process.env.ARANGO_URL
});
db.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASS);
ensureDbExists(dbname)
.then(() => db.useDatabase(dbname))
.then(() => ensureCollectionExists('battles'))
.then(() => ensureCollectionExists('users'))
.then(() => ensureCollectionExists('inits'))
.then(() => {
    return new Promise((resolve, reject) =>{
        var inits = db.collection('inits');
        inits.truncate().then(() => {
            fs.readFile(`./data/init.battle.json`, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                var i = JSON.parse(data);
                i._key = 'battle';
                inits.save(i).then(n => {
                    resolve(i);
                });
            });        
        });
    });
});

function get(id) {
    var battles = db.collection(this);
    return new Promise((resolve, reject) => {
        if (!id) {
            resolve(null);
        }

        battles.document(id).then(doc => {
            resolve(doc);
        }).catch(err => {
            if (err.code == 404){
                resolve(null);
            }
            else{
                reject(err);
            }
        });
    });
}

function getBy(prop, val) {
    var battles = db.collection(this);
    return new Promise((resolve, reject) => {
        var example = {};
        example[prop] = val;
        battles.firstExample(example).then(doc => {
            resolve(doc);
        }).catch(err => {
            if (err.code == 404){
                resolve(null);
            }
            else{
                reject(err);
            }
        });
    });
}

function store(data) {
    var battles = db.collection(this);
    return new Promise((resolve, reject) => {
        exists.bind(this)(data._key).then(existing => {
            if (existing){
                battles.update(data._key, data);
                resolve(data);
            }
            else {
                battles.save(data).then(n => {
                    resolve(data);
                });
            }
        });
    });
}

function exists(id) {
    return get.bind(this)(id).then(x => x ? true : false);
}

var interface = (colName) => {
    return {
        get: get.bind(colName), 
        store: store.bind(colName),
        exists: exists.bind(colName),
        getBy: getBy.bind(colName),
    }
};

module.exports = {
    battleTemplates: interface("inits"),
    battles: interface("battles"),
    users: interface("users")
};