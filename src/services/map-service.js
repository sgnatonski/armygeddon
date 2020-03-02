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
    //var user = await storage.users.get(req.userId);
    try {
        const cursor = await storage.query(aql`WITH passages
        FOR vertex
          IN 0..10
          ANY 'tiles/3580745'
          GRAPH 'map'
          OPTIONS { bfs: true, uniqueVertices: 'global' }
          RETURN vertex`);
        var tiles = await cursor.all();
        return tiles.map(t => undoc(t));
    }
    catch (error) {
        log.error(error.message);
        throw Error(error.message);
    }
});