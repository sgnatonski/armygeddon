var storage = require('../storage/arango/arango_storage');
var aql = require("arangojs").aql;

var openBattles = [];

var lastFetch = new Date().setMinutes(-5);

async function fetch(){
    if (lastFetch >= new Date().setMinutes(-5)){
        return openBattles;
    }

    const cursor = await storage.query(aql`
    FOR b IN battles
    FILTER !HAS(b, "winningArmy") AND DATE_DIFF(b.created, DATE_NOW(), 'i') < 60
    AND (CONCAT('_', ATTRIBUTES(b.armies)[0]) != ATTRIBUTES(b.armies)[1])
    RETURN { 
        id: b._key, 
        players: [ b.armies[ATTRIBUTES(b.armies)[0]].name, b.armies[ATTRIBUTES(b.armies)[1]].name ],
        created: b.created 
    }
    `);
    openBattles = await cursor.all();
    lastFetch = new Date();
    return openBattles;
}

function add(battleid, player){
    openBattles.push({ id: battleid, players: [player] });
}

function update(battleid, player){
    var b = openBattles.find(x => x.id === battleid); 
    b.players.push(player);
}

module.exports = {
    getOpen: fetch,
    addOpen: add,
    updateOpen: update
};