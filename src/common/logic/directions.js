var turns = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1},
    {x: 1, y: -1},
];

function getDirection(unitX, unitY, x, y) {
    var diffX = x - unitX;
    var diffY = y - unitY;
    var direction = turns.findIndex(t => t.x == diffX && t.y == diffY) + 1;
    return direction;
};

function setDirections(unit, dirSize) {
    function ensureDirRange(dir){
        if (dir > 6) return 1;
        if (dir < 1) return 6;
        return dir;
    }
    
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

module.exports = {
    getTurns: () => turns,
    getDirection,
    setDirections
};