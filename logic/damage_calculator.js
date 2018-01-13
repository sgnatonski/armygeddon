var calculator = {
    applyAttackDamage: (attacker, defender) => {
        if (attacker.type == 'arch'){
            calculator.applyRangeDamage(attacker, defender);
        }
        else{
            calculator.applyChargeDamage(attacker, defender);
        }
    },
    applyRangeDamage: (attacker, defender) => {
        var dmg = attacker.damage + (attacker.charge / 2) - defender.armor;
        var distance = Math.max(...[Math.abs(attacker.pos.x - defender.pos.x), Math.abs(attacker.pos.y - defender.pos.y)]);
        if (distance == 1){
            distance = attacker.range * 2;
        }
        var distanceDamage = Math.floor(dmg * attacker.range / distance);
        defender.endurance -= distanceDamage;
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    },
    applyChargeDamage: (attacker, defender) => {
        var charge = attacker.charge - 1;
        if (charge < 0){
            charge = 0;
        }
        var dmg = attacker.damage + charge - defender.armor;
        defender.endurance -= dmg;
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    }
};

module.exports = calculator;