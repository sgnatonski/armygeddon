module.exports = {
    restore: {
        firstTurn: (unit, unitType) => {
            return Object.assign(unit, unitType, unitType.lifetime);
        },
        nextTurn: (unit, unitType) => {
            return Object.assign(unit, unitType);
        }
    }
}