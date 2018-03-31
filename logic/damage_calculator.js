var directions = require('./directions');

var calculator = {
    getRangeDamage: (attacker, defender) => {
        var dmg = attacker.damage + (attacker.charge / 2) - defender.armor;
        var distance = Math.max(...[Math.abs(attacker.pos.x - defender.pos.x), Math.abs(attacker.pos.y - defender.pos.y)]);
        var defenseDirection = directions.getDirection(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
        var dirDefense = defender.directions.some(d => d == defenseDirection);

        if (distance == 1 || dirDefense){
            distance = attacker.range * 2;
        }
        var distanceDamage = Math.floor(dmg * attacker.range / distance);
        return distanceDamage;
    },
    getChargeDamage: (attacker, defender) => {
        var charge = Math.pow(attacker.charge - 1, 2);
        var attackDirection = directions.getDirection(attacker.pos.x, attacker.pos.y, defender.pos.x, defender.pos.y);
        var defenseDirection = directions.getDirection(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
        var dirAttack = attacker.directions.some(d => d == attackDirection);
        var dirDefense = defender.directions.some(d => d == defenseDirection);

        if (dirAttack && attacker.directions[0] == defender.directions[0]){
            charge = charge * 2;
        }
        
        if (charge < 0 || !dirAttack){
            charge = 0;
        }
        var armor = dirDefense ? defender.armor : 0;
        var dmg = attacker.damage + charge - armor;
        return dmg;
    }
};

module.exports = calculator;