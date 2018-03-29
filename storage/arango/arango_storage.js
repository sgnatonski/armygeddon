var db = require('./init_database');

async function get(id) {
    if (!id) {
        return null;
    }

    var collection = db.collection(this);
    try {    
        return await collection.document(id);
    }
    catch(err) {
        if (err.code == 404){
            return null;
        }
        throw err;
    }
}

async function getBy(prop, val) {
    var collection = db.collection(this);
    var example = {};
    example[prop] = val;
    try {    
        return await collection.firstExample(example);
    }
    catch(err){
        if (err.code == 404){
            return null;
        }
        throw err;
    }
}

async function store(data) {
    var collection = db.collection(this);
    var existing = await exists.bind(this)(data._key);
    if (existing){
        collection.update(data._key, data);        
    }
    else {
        await collection.save(data)
    }
    return data;
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
    }
};

module.exports = {
    battleTemplates: interface("inits"),
    battles: interface("battles"),
    users: interface("users")
};