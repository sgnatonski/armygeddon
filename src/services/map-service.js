var cote = require('cote');
var storage = require('@internal/common/storage/arango/arango_storage');

var responder = new cote.Responder({
    name: 'map responder',
    namespace: 'map',
    respondsTo: ['get']
});

responder.on('*', console.log);

responder.on('get', async req => {
    var map = await storage.map.get('map');
    return map;
});