var aql = require("arangojs").aql;
var crypto = require("crypto");
var storage = require('../storage/arango/arango_storage');
var directions = require('./directions');
var log = require('../logger');

function createDefaultSides() {
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
}

async function assignNextCoords() {
    try {
        const cursor = await storage.query(aql`
            FOR t IN map
            FILTER t.sides[*].active ANY == false
            LET sides = (FOR s in t.sides FILTER s.active == false RETURN DISTINCT POSITION(t.sides, s, true))
            RETURN { 
                id: t._key,
                coord: t.coord,
                sides: sides
            } 
            `);
        var openTiles = await cursor.all();
        if (!openTiles.length) {
            return (crypto.randomBytes(8).toString("hex"), { x: 0, y: 0 });
        }

        var tile = openTiles[0];

        var side = tile.sides[0];

        tile.sides[side].active = true;
        await storage.map.store(tile);

        return {
            x: tile.coord.x + directions.getTurns()[side].x,
            y: tile.coord.y + directions.getTurns()[side].y
        };
    }
    catch (err) {
        log.error(err);
        throw err.message;
    }
}

module.exports = {    
    assignStartingTile: async (armyId) => {
        var coord = await assignNextCoords();
        var tile = {
            id: crypto.randomBytes(8).toString("hex"),
            coord: coord,
            armyId: armyId,
            sides: createDefaultSides()
        };

        await storage.map.store(tile);

        return tile;
    }
}