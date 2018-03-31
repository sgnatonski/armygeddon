function battle(battle) {
    return {
        getAllUnits() {
            return Object.keys(battle.armies).map(key => Object.keys(battle.armies[key].units).map(unitId => battle.armies[key].units[unitId]))
                .reduce((a, b) => a.concat(b));
        },
        getUnitAt(x, y) {
            return this.getAllUnits(battle).find(u => u.pos.x == x && u.pos.y == y);
        },
        isSameArmy(unit1, unit2) {
            if (!unit1 || !unit2) {
                return false;
            }

            var armies = Object.keys(battle.armies)
                .map(a => battle.armies[a])
                .map(army => {
                    return {
                        id: army.id,
                        army: Object.keys(army.units).map(u => army.units[u])
                    }
                });
            var unit1Army = armies[0].army.find(u => u.id == unit1.id);
            var army = armies[0].army;
            if (!unit1Army) {
                unit1Army = armies[1].army.find(u => u.id == unit1.id);
                army = armies[1].army;
            }
            return army.some(u => u.id == unit2.id);
        },
        getPlayerUnit(playerId, unitId) {
            if (Array.isArray(playerId)) {
                if (!battle.armies[playerId[0]]) {
                    return null;
                }
                if (!battle.armies[playerId[1]]) {
                    return null;
                }

                var unit = battle.armies[playerId[0]].units[unitId];
                if (!unit) {
                    unit = battle.armies[playerId[1]].units[unitId];
                }
                return unit;
            }
            else {
                if (!battle.armies[playerId]) {
                    return null;
                }

                var unit = battle.armies[playerId].units[unitId];
                return unit;
            }
        },
        getCurrentTurn() {
            return battle.turns[battle.turns.length - 1];
        }
    }
}

module.exports = battle;