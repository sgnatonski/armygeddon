var cote = require('cote');
var tmpl = require('@internal/common/storage/arango/arango_storage').battleTemplates;

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
    name: 'design responder',
    namespace: 'design',
    respondsTo: ['create']
});

responder.on('*', console.log);

responder.on('create', async req => {
    var t = {
        id: 'battle.' + req.body.name,
        terrain: req.body.terrain,
        sceneSize: getSceneSize(req.body.terrain)
    };
    await tmpl.store(t);
});