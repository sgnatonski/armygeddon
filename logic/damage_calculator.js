var calculator = {
    applyAttackDamage: (attacker, defender, dirAttack, dirDefense) => {
        if (attacker.type == 'arch'){
            calculator.applyRangeDamage(attacker, defender, dirDefense);
        }
        else{
            calculator.applyChargeDamage(attacker, defender, dirAttack, dirDefense);
        }
    },
    applyRangeDamage: (attacker, defender, dirDefense) => {
        var dmg = attacker.damage + (attacker.charge / 2) - defender.armor;
        var distance = Math.max(...[Math.abs(attacker.pos.x - defender.pos.x), Math.abs(attacker.pos.y - defender.pos.y)]);
        if (distance == 1 || dirDefense){
            distance = attacker.range * 2;
        }
        var distanceDamage = Math.floor(dmg * attacker.range / distance);
        defender.endurance -= distanceDamage;
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    },
    applyChargeDamage: (attacker, defender, dirAttack, dirDefense) => {
        var charge = attacker.charge - 1;
        if (charge < 0 || !dirAttack){
            charge = 0;
        }
        var armor = dirDefense ? defender.armor : 0;
        var dmg = attacker.damage + charge - armor;
        defender.endurance -= dmg;
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    }
};

module.exports = calculator;