var storage = require('../storage/arango/arango_storage');
var aql = require("arangojs").aql;
var log = require('../logger');

var s = Math.floor(Math.sqrt(3) / 2 * 100); // 86

const grid = [
    [-100, 0],
    [-50, s],
    [50, s],
    [100, -0],
    [50, -s],
    [-50, -s],
];

module.exports = {
    assignStartingTile: async (userName, userId, armyId) => {
        // TODO
        // make sure it runs sequentially, so only one tile assignement can be executed at a time regardless number of requests
        try {
            const cursor = await storage.query(aql`RETURN FIRST(
                FOR tile IN tiles
                LET edgesCount = LENGTH(FOR v IN 1..1 ANY tile GRAPH 'map' RETURN 1)
                FILTER edgesCount < 6
                SORT edgesCount DESC
                RETURN { id: tile._id, center: tile.coord, occupied: (
                    FOR v IN 1..1 
                    ANY tile 
                    GRAPH 'map' 
                    LET ec = LENGTH(FOR x IN 1..1 ANY v._id GRAPH 'map' RETURN 1) 
                    RETURN { id: v._id, coord: v.coord, edges: ec }
                )}
            )`);

            var firstInsufficientNeighborsTile = await cursor.next();
            var coord = {
                x: 0,
                y: 0
            };
            var newPassages = [];

            if (firstInsufficientNeighborsTile) {
                var occupied = firstInsufficientNeighborsTile.occupied.map(o => ({
                    id: o.id,
                    x: o.coord.x,
                    y: o.coord.y,
                    edges: o.edges
                }));

                var neighbors = grid.map(g => ({
                    x: firstInsufficientNeighborsTile.center.x + g[0],
                    y: firstInsufficientNeighborsTile.center.y + g[1]
                }));

                var available = neighbors.filter(n => !occupied.some(o => o.x == n.x && o.y == n.y));
                coord = available[0];
                
                var newNeighbors = grid.map(g => ({
                    x: coord.x + g[0],
                    y: coord.y + g[1],
                }));

                var intersection = occupied.filter(n => {
                    for (var i = 0; i < newNeighbors.length; i++) {
                        if (n.edges < 6 && n.x == newNeighbors[i].x && n.y == newNeighbors[i].y) {
                            return true;
                        }
                    }
                    return false;
                });

                newPassages = [firstInsufficientNeighborsTile.id, ...intersection.map(o => o.id)];                
            }
                
            var map = await storage.map;
            var startingTile = await map.vertexCollection('tiles').save({
                owner: userName,
                userId: userId,
                armyId: armyId,
                type: "fort",
                coord: coord
            });

            var passages = map.edgeCollection('passages');
            for (const c of newPassages) {
                await passages.save({}, startingTile._id, c);
            }

            return startingTile._id;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}