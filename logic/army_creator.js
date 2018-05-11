var storage = require('../storage/arango/arango_storage');

module.exports = async(userId) => {
    var army = await storage.battleTemplates.get('army.default');

    army.playerId = userId;
    army.id = crypto.randomBytes(8).toString("hex");
    army.name = 'default';
    army.units = army.units.map(u => Object.assign({
      id: crypto.randomBytes(8).toString("hex"),
      experience: 0,
      rank: 0
    }, u));
  
    await storage.armies.store(army);
}