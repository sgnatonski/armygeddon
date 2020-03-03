var storage = require('../storage/arango/arango_storage');
var aql = require("arangojs").aql;
var log = require('../logger');

var s = Math.floor(Math.sqrt(3) / 2 * 100);

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
        try {
            const cursor = await storage.query(aql`RETURN FIRST(
                FOR tile IN tiles
                LET anyEdgesCount = LENGTH(FOR v IN 1..1 ANY tile GRAPH 'map' RETURN 1)
                FILTER anyEdgesCount < 6
                RETURN { id: tile._key, center: tile.coord, occupied: (FOR v IN 1..1 ANY tile GRAPH 'map' RETURN { id: v._key, coord: v.coord })}
            )`);

            var firstInsufficientNeighborsTile = await cursor.next();
            var coord = {
                x: 0,
                y: 0
            };
            var connect = [];

            if (firstInsufficientNeighborsTile) {
                var occupied = firstInsufficientNeighborsTile.occupied.map(o => ({
                    id: o.id,
                    x: firstInsufficientNeighborsTile.center.x - o.coord.x,
                    y: firstInsufficientNeighborsTile.center.y - o.coord.y,
                }));
                var available = grid.find(g => !occupied.some(o => o.x == g[0] && o.y == g[1]));
                coord.x = firstInsufficientNeighborsTile.center.x + available[0];
                coord.y = firstInsufficientNeighborsTile.center.y + available[1];

                connect = [
                    firstInsufficientNeighborsTile.id,
                    ...occupied.filter(o => grid.some(g => o.x == g[0] && o.y == g[1])).map(o => o.id)
                ];
            }

            var map = await storage.map;
            var startingTile = await map.vertexCollection('tiles').save({
                owner: userName,
                name: `Area of ${userName}`,
                userId: userId,
                armyId: armyId,
                coord: coord
            });

            var edgeCollection = map.edgeCollection('passages');
            for (const c of connect){
                await edgeCollection.save({},
                    `tiles/${startingTile._key}`,
                    `tiles/${c}`
                );
            }

            return startingTile._key;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}