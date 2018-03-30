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
        FILTER !HAS(b, "winningArmy") AND (CONCAT('_', ATTRIBUTES(b.armies)[0]) != ATTRIBUTES(b.armies)[1])
        RETURN { id: b._key, players: ATTRIBUTES(b.armies) }
    `);
    const openBattles = await cursor.all();
    lastFetch = new Date();
    return openBattles;
}

function add(battleid, players){
    openBattles.add(battleid);
}

module.exports = {
    getOpen: fetch,
    addOpen: add
};