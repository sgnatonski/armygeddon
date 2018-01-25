function ensureDirRange(dir){
    if (dir > 6) return 1;
    if (dir < 1) return 6;
    return dir;
}

module.exports = {
    restore: {
        firstTurn: (unit, unitType) => {
            return Object.assign(unit, unitType, unitType.lifetime);
        },
        nextTurn: (unit, unitType) => {
            return Object.assign(unit, unitType);
        }
    },
    setDirections: (unit, dirSize) => {
        if (dirSize > unit.maxDirections){
            dirSize = unit.maxDirections;
        }
        currentDir = unit.directions[0];
        unit.directions = Array(dirSize);
        unit.directions[0] = currentDir;
        var i = 1;
        while(i < dirSize){
            unit.directions[i] = ensureDirRange(unit.directions[0] + i);
            unit.directions[i + 1] = ensureDirRange(unit.directions[0] - i);
            i = i + 2;
        }
    }
}