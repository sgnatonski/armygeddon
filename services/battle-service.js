var cote = require('cote');
var storage = require('../storage/arango/arango_storage');
var battleScope = require('../logic/battle_scope');

var responder = new cote.Responder({
    name: 'battle responder',
    namespace: 'battle',
    respondsTo: ['start', 'join', 'selfjoin', 'get', 'process']
});

var armyRequester = new cote.Requester({
    name: 'army requester',
    namespace: 'army'
});

var battleTrackerRequester = new cote.Requester({
    name: 'battle tracker requester',
    namespace: 'battle_tracker'
});

responder.on('*', console.log);

responder.on('start', async req => {
    var data = await storage.battleTemplates.get('battle.tiny_round_1');
    var ut = await storage.battleTemplates.get('unittypes');
    var army = await storage.armies.getBy('playerId', req.playerId);
    var battle = battleScope(data, req.playerId, req.name).init(ut, army);
    await storage.battles.store(battle);
    await battleTrackerRequester.send({ type: 'addOpen', battleId: battle.id, player: req.name });    
    return battle.id;
});

responder.on('get', async req => {
    var battle = await storage.battles.get(req.battleId);
    return battle;
});

responder.on('join', async req => {
    var data = await storage.battles.get(req.battleId);
    var army = await storage.armies.getBy('playerId', req.playerId);
    var battle = battleScope(data, req.playerId, req.name).join(army);
    await storage.battles.store(battle);
    await battleTrackerRequester.send({ type: 'updateOpen', battleId: battle.id, player: req.name });
    return battle;
});

responder.on('selfjoin', async req => {
    var data = await storage.battles.get(req.battleId);
    var army = await storage.armies.getBy('playerId', req.playerId);
    army.units.forEach(x => x.id = '_' + x.id);
    var battle = battleScope(data, '_' + req.playerId, req.name).join(army);
    await storage.battles.store(battle);
    await battleTrackerRequester.send({ type: 'updateOpen', battleId: battle.id, player: req.name });
    return battle;
});

responder.on('process', async req => {
    var data = await storage.battles.get(req.battleId);
    var result = battleScope(data, req.playerId, req.name).processCommand(req.cmd);
    if (result && result.success) {
        await storage.battles.store(result.battle);
        if (result.ended) {
            await armyRequester.send({ type: 'update', experience: result.experience });
        }
    }

    return result;
});