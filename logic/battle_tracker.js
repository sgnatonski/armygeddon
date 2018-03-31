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
    FILTER !HAS(b, "winningArmy") 
    AND (CONCAT('_', ATTRIBUTES(b.armies)[0]) != ATTRIBUTES(b.armies)[1])
    RETURN { 
        id: b._key, 
        players: (FOR u IN users FOR n in ATTRIBUTES(b.armies) FILTER u._key == n RETURN u.name) 
    }
    `);
    openBattles = await cursor.all();
    lastFetch = new Date();
    return openBattles;
}

function add(battleid, players){
    openBattles.push({ id: battleid, players: players });
}

module.exports = {
    getOpen: fetch,
    addOpen: add
};