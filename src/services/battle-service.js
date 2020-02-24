var cote = require('cote');
var storage = require('@internal/common/storage/arango/arango_storage');
var battleScope = require('@internal/common/logic/battle_scope');

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

var battleTemplateRequester = new cote.Requester({
    name: 'battle template requester',
    namespace: 'battle_template'
});

responder.on('*', console.log);

responder.on('start', async req => {
    var templateName = await battleTemplateRequester.send({ type: 'random' });
    var data = await storage.battleTemplates.get(`battle.${templateName}`);
    var ut = await storage.battleTemplates.get('unittypes');
    var army = await storage.armies.getBy('playerId', req.playerId);
    var battle = battleScope(data, req.playerId, req.name).init(ut, army, req.mode);
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
    return battle;
});

responder.on('process', async req => {
    var data = await storage.battles.get(req.battleId);
    if (data.mode == 'single') {
        var pid = req.playerId;
        if (req.cmd.uid.startsWith('_') && !pid.startsWith('_')) {
            pid = '_' + pid;
        }
        else if (!req.cmd.uid.startsWith('_') && pid.startsWith('_')) {
            pid = pid.substr(1);
        }
    }
    var result = battleScope(data, pid, req.name).processCommand(req.cmd);
    if (result && result.success) {
        await storage.battles.store(result.battle);
        if (result.ended) {
            await armyRequester.send({ type: 'update', experience: result.experience });
        }
    }

    return result;
});