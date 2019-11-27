var aql = require("arangojs").aql;
var crypto = require("crypto");
var storage = require('../storage/arango/arango_storage');
var directions = require('./directions');

module.exports = {
    createDefaultSides: () => {
        return [
            {
                type: 0,
                updated: 0,
                active: false
            },
            {
                type: 0,
                updated: 0,
                active: false
            },
            {
                type: 0,
                updated: 0,
                active: false
            },
            {
                type: 0,
                updated: 0,
                active: false
            },
            {
                type: 0,
                updated: 0,
                active: false
            },
            {
                type: 0,
                updated: 0,
                active: false
            }
        ];
    },

    assignNextCoords: async () => {
        try {
            const cursor = await storage.query(aql`
                FOR t IN map
                FILTER t.sides[*].active ANY == false
                LET sides = (FOR s in t.sides FILTER s.active == false RETURN DISTINCT POSITION(t.sides, s, true))
                RETURN { 
                    tile: t,
                    sides: sides
                } 
                `);
            var openTiles = await cursor.all();
            if (!openTiles.length) {
                return { id: crypto.randomBytes(8).toString("hex"), x: 0, y: 0 };
            }

            var side = openTiles[0].sides[0];

            tile.sides[side].active = true;
            await storage.map.store(tile);

            return {
                id: crypto.randomBytes(8).toString("hex"),
                x: openTiles[0].tile.coord.x + directions.getTurns()[side].x,
                y: openTiles[0].tile.coord.y + directions.getTurns()[side].y
            }
        }
        catch (err) {
            throw err.message;
        }
    }
}