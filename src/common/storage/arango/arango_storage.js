var db = require('./init_database');
var aql = require("arangojs").aql;
var log = require('../../logger');

const dbPromise = db();

function undoc(doc){
    doc.id = doc._key;
    delete doc._key;
    delete doc._rev;
    delete doc._id;
    return doc;
}

async function get(id) {
    if (!id) {
        try {    
            var collection = (await dbPromise).collection(this);
            var docs = await collection.all();
            return docs.map(d => undoc(d));
        }
        catch(err) {
            if (err.code == 404){
                log.warn(`${err.errorNum == 1202 ? "Document": "Collection"} "${this}" not found`);
                return null;
            }
            throw err;
        }
    }

    try {    
        var collection = (await dbPromise).collection(this);
        var doc = await collection.document(id);
        return undoc(doc);
    }
    catch(err) {
        if (err.code == 404){
            log.warn(`${err.errorNum == 1202 ? "Document": "Collection"} "${this}" not found`);
            return null;
        }
        throw err;
    }
}

async function getBy(prop, val) {
    var example = {};
    example[prop] = val;
    try {    
        var collection = (await dbPromise).collection(this);
        var doc = await collection.firstExample(example);
        return undoc(doc);
    }
    catch(err){
        if (err.code == 404){
            log.warn(`Collection "${this}" not found`);
            return null;
        }
        throw err;
    }
}

async function getAllBy(prop, val) {
    var example = {};
    example[prop] = val;
    try {    
        var collection = (await dbPromise).collection(this);
        var docs = await collection.byExample(example);
        return docs.map(d => undoc(d));
    }
    catch(err){
        if (err.code == 404){
            log.warn(`Collection "${this}" not found`);
            return null;
        }
        throw err;
    }
}

async function store(data) {
    data._key = data.id;
    var existing = await exists.bind(this)(data._key);
    var collection = (await dbPromise).collection(this);
    if (existing){
        collection.update(data._key, data);        
    }
    else {
        await collection.save(data);
    }
    return undoc(data);
}

async function exists(id) {
    var collection = (await dbPromise).collection(this);
    return await collection.documentExists(id);
}

async function graph(){
    return await (await dbPromise).graph(this);
}

var interface = (colName) => {
    return {
        get: get.bind(colName), 
        store: store.bind(colName),
        exists: exists.bind(colName),
        getBy: getBy.bind(colName),
        getAllBy: getAllBy.bind(colName),
        graph: graph.bind(colName)
    }
};

module.exports = {
    battleTemplates: interface("inits"),
    battles: interface("battles"),
    users: interface("users"),
    armies: interface("armies"),
    map: interface("map").graph(),
    models: interface("models"),
    rulesets: interface("rulesets"),
    query: async(...args) => {
        var d = await dbPromise;
        return await d.query.bind(d)(...args);
    }
};