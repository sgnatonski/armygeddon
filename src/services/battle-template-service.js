var cote = require('cote');
var aql = require("arangojs").aql;
var storage = require('@internal/common/storage/arango/arango_storage');
var log = require('@internal/common/logger');

function getSceneSize(terrain) {
    var tx = terrain.map(x => x.x);
    var ty = terrain.map(x => x.y);
    var minX = Math.abs(Math.min(...tx));
    var maxX = Math.abs(Math.max(...tx));
    var minY = Math.abs(Math.min(...ty));
    var maxY = Math.abs(Math.max(...ty));
    var sceneSize = Math.max(...[minX, maxX, minY, maxY]);
    return sceneSize;
};

var responder = new cote.Responder({
    name: 'battle template responder',
    namespace: 'battle_template',
    respondsTo: ['create', 'list']
});

responder.on('*', console.log);

responder.on('create', async req => {
    var t = {
        id: 'battle.' + req.name,
        terrain: req.terrain,
        sceneSize: getSceneSize(req.terrain)
    };
    await storage.battleTemplates.store(t);
});

responder.on('list', async req => {
    try {
        const cursor = await storage.query(aql`FOR b IN inits
            FILTER b._key LIKE "battle.%"
            LET name = SPLIT(b._key, ".")[1]
            RETURN name`);
        var list = await cursor.all();
        return list;
    }
    catch (error) {
        log.error(error.message);
        throw Error(error.message);
    }
});

responder.on('random', async req => {
    try {
        const cursor = await storage.query(aql`FOR b IN inits
            FILTER b._key LIKE "battle.%"
            SORT RAND()
            LIMIT 1
            LET name = SPLIT(b._key, ".")[1]
            RETURN name`);
        var rnd = await cursor.next();
        return rnd;
    }
    catch (error) {
        log.error(error.message);
        throw Error(error.message);
    }
});