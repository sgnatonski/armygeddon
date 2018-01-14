var calculator = require('./damage_calculator');

var resolver = {
    applyAttackDamage: (attacker, defender) => {
        if (attacker.type == 'arch'){
            resolver.applyRangeDamage(attacker, defender);
        }
        else{
            resolver.applyChargeDamage(attacker, defender);
        }
    },
    applyRangeDamage: (attacker, defender) => {        
        defender.endurance -= calculator.getRangeDamage(attacker, defender);
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    },
    applyChargeDamage: (attacker, defender) => {        
        defender.endurance -= calculator.getChargeDamage(attacker, defender);
        if (defender.endurance < 0){
            defender.endurance = 0;
        }
        attacker.charge = 0;
    }
};

module.exports = resolver;