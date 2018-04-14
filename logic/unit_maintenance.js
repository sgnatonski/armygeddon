module.exports = function(unit, unittype){
    var cost = 2;
    cost += unittype.mobility;
    cost += unittype.damage;
    cost += unittype.maxDirections;
    cost += unittype.armor;
    cost += unittype.range * 2;
    cost += Math.ceil(unit.endurance / 5);
    cost += Math.floor(unit.experience / 100);
    cost += unit.rank;

    return cost;
}