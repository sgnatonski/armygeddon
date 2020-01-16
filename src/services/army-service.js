var cote = require('cote');
var crypto = require("crypto");
var storage = require('@internal/common/storage/arango/arango_storage');
var mapRegistry = require('@internal/common/logic/map_registry');

var responder = new cote.Responder({
    name: 'army responder',
    namespace: 'army',
    respondsTo: ['create', 'armies', 'update']
});

responder.on('*', console.log);

responder.on('create', async req => {
    var army = await storage.battleTemplates.get('army.default');

    army.playerId = req.userId;
    army.id = crypto.randomBytes(8).toString("hex");
    army.name = 'default';
    army.units = army.units.map(u => Object.assign({
      id: crypto.randomBytes(8).toString("hex"),
      experience: 0,
      rank: 0
    }, u));
  
    await storage.armies.store(army);
    var tile = await mapRegistry.assignStartingTile(army.id);
    return [tile.id];
});

responder.on('armies', async req => {
    return await storage.armies.getAllBy('playerId', req.playerId);
});

responder.on('update', async req => {
    for (var i in req.experience) {
        if (req.experience.hasOwnProperty(i)) {
            var army = await storage.armies.get(i);
            req.experience[i].forEach(u => {
                var unit = army.units.find(x => x.id == u.unitId);
                unit.experience += u.expGain;
            });
            await storage.armies.store(army);
        }
    }
});