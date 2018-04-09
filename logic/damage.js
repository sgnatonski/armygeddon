var calculator = require('./damage_calculator');

module.exports = {
    applyDamage: (attacker, defender) => {
        var dmg = 0;
        if (attacker.type == 'arch'){
            dmg = calculator.getRangeDamage(attacker, defender);
        }
        else{
            dmg = calculator.getChargeDamage(attacker, defender);
        }

        defender.endurance -= dmg;
        if (defender.endurance < 0){
            defender.endurance = 0;
        }

        return dmg;
    }
};