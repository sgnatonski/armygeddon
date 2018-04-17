var storage = require('../storage/arango/arango_storage');
var aql = require("arangojs").aql;

var players = [];

var lastFetch = new Date().setMinutes(-30);

async function fetch(){
    if (lastFetch >= new Date().setMinutes(-30)){
        return players;
    }

    const cursor = await storage.query(aql`
    FOR u IN users
    FOR a IN armies
    FILTER a.playerId == u._key
    COLLECT playerName = u.name, expSum = SUM(a.units[*].experience), rankAvg = AVG(a.units[*].rank) 
    SORT expSum DESC, rankAvg DESC
    RETURN {
        "playerName" : playerName,
        "totalExp" : expSum,
        "totalRank" : rankAvg
    }
    `);
    players = await cursor.all();
    lastFetch = new Date();
    return players;
}

module.exports = {
    getRanking: fetch
};