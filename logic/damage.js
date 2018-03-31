var calculator = require('./damage_calculator');

function applyRangeDamage (attacker, defender) {        
    defender.endurance -= calculator.getRangeDamage(attacker, defender);
    if (defender.endurance < 0){
        defender.endurance = 0;
    }
    attacker.charge = 0;
}
function applyChargeDamage (attacker, defender) {        
    defender.endurance -= calculator.getChargeDamage(attacker, defender);
    if (defender.endurance < 0){
        defender.endurance = 0;
    }
    attacker.charge = 0;
}

module.exports = {
    applyDamage: (attacker, defender) => {
        if (attacker.type == 'arch'){
            applyRangeDamage(attacker, defender);
        }
        else{
            applyChargeDamage(attacker, defender);
        }
    }
};