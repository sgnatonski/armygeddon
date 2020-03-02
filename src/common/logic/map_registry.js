var storage = require('../storage/arango/arango_storage');
var log = require('../logger');

module.exports = {
    assignStartingTile: async (userName, userId, armyId) => {
        try {
            var map = await storage.map;
            var startingTile = await map.vertexCollection('tiles').save({
                owner: userName,
                name: `Area of ${userName}`,
                userId: userId,
                armyId: armyId
            });

            return startingTile;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}