var cote = require('cote');
var aql = require("arangojs").aql;
var storage = require('@internal/common/storage/arango/arango_storage');
var log = require('@internal/common/logger');

var responder = new cote.Responder({
    name: 'map responder',
    namespace: 'map',
    respondsTo: ['get']
});

function undoc(doc){
    doc.id = doc._key;
    delete doc._key;
    delete doc._rev;
    delete doc._id;
    return doc;
}

responder.on('*', console.log);

responder.on('get', async req => {
    var user = await storage.users.get(req.userId);
    try {
        const cursor = await storage.query(aql`WITH passages
        FOR v
          IN 0..10
          ANY ${user.capital}
          GRAPH 'map'
          OPTIONS { bfs: true, uniqueVertices: 'global' }
          RETURN { 
            id: v._key, 
            coord: v.coord, 
            owner: v.owner,
            owned: v.userId == ${user.id},
            armyId: v.armyId,
            type: v.type
        }`);
        var tiles = await cursor.all();
        return tiles.map(t => undoc(t));
    }
    catch (error) {
        log.error(error.message);
        throw Error(error.message);
    }
});