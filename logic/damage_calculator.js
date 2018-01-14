var directions = require('./directions');

var calculator = {
    getRangeDamage: (attacker, defender) => {
        var dmg = attacker.damage + (attacker.charge / 2) - defender.armor;
        var distance = Math.max(...[Math.abs(attacker.pos.x - defender.pos.x), Math.abs(attacker.pos.y - defender.pos.y)]);
        var defenseDirection = directions(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
        var dirDefense = defenseDirection == defender.direction;

        if (distance == 1 || dirDefense){
            distance = attacker.range * 2;
        }
        var distanceDamage = Math.floor(dmg * attacker.range / distance);
        return distanceDamage;
    },
    getChargeDamage: (attacker, defender) => {
        var charge = Math.pow(attacker.charge - 1, 2);
        var attackDirection = directions(attacker.pos.x, attacker.pos.y, defender.pos.x, defender.pos.y);
        var defenseDirection = directions(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
        var dirAttack = attackDirection == attacker.direction;
        var dirDefense = defenseDirection == defender.direction;

        if (charge < 0 || !dirAttack){
            charge = 0;
        }
        var armor = dirDefense ? defender.armor : 0;
        var dmg = attacker.damage + charge - armor;
        return dmg;
    }
};

module.exports = calculator;