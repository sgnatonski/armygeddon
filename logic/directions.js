var turns = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1},
    {x: 1, y: -1},
];

var getDirection = (unitX, unitY, x, y) =>{
    var diffX = x - unitX;
    var diffY = y - unitY;
    var direction = turns.findIndex(t => t.x == diffX && t.y == diffY) + 1;
    return direction;
};

module.exports = getDirection;