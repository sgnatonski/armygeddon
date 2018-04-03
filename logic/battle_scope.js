var bc = require('./battle_creator');
var bp = require('./battle_processor');
var bh = require('./battle_helper');

function scope(battle, playerId, playerName){
    var helper = bh(battle);
    var creator = bc(battle, playerId, playerName, helper);
    var processor = bp(battle, playerId, helper);
    return Object.assign(creator, processor);
}

module.exports = scope;