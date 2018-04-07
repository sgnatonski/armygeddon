var db = require('./init_database');
var aql = require("arangojs").aql;

function undoc(doc){
    doc.id = doc._key;
    delete doc._key;
    delete doc._rev;
    delete doc._id;
    return doc;
}

async function get(id) {
    if (!id) {
        return null;
    }

    var collection = (await db).collection(this);
    try {    
        var doc = await collection.document(id);
        return undoc(doc);
    }
    catch(err) {
        if (err.code == 404){
            return null;
        }
        throw err;
    }
}

async function getBy(prop, val) {
    var collection = (await db).collection(this);
    var example = {};
    example[prop] = val;
    try {    
        var doc = await collection.firstExample(example);
        return undoc(doc);
    }
    catch(err){
        if (err.code == 404){
            return null;
        }
        throw err;
    }
}

async function getAllBy(prop, val) {
    var collection = (await db).collection(this);
    var example = {};
    example[prop] = val;
    try {    
        var docs = await collection.byExample(example);
        return docs.map(d => undoc(d));
    }
    catch(err){
        if (err.code == 404){
            return null;
        }
        throw err;
    }
}

async function store(data) {
    var collection = (await db).collection(this);
    data._key = data.id;
    var existing = await exists.bind(this)(data._key);
    if (existing){
        collection.update(data._key, data);        
    }
    else {
        await collection.save(data);
    }
    return undoc(data);
}

async function exists(id) {
    return await get.bind(this)(id) ? true : false;
}

var interface = (colName) => {
    return {
        get: get.bind(colName), 
        store: store.bind(colName),
        exists: exists.bind(colName),
        getBy: getBy.bind(colName),
        getAllBy: getAllBy.bind(colName)
    }
};

module.exports = {
    battleTemplates: interface("inits"),
    battles: interface("battles"),
    users: interface("users"),
    armies: interface("armies"),
    query: async(...args) => {
        var d = await db;
        return await d.query.bind(d)(...args);
    }
};