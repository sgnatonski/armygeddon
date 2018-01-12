var calculator = {
    applyAttackDamage: (attacker, defender) => {
        defender.endurance -= attacker.damage - defender.armor;
    },
    applyRangeDamage: (attacker, defender) => {
        defender.endurance -= attacker.damage * (1 + Math.random()) - defender.armor;
    },
    applyChargeDamage: (attacker, defender) =>{
        defender.endurance -= attacker.damage + (attacker.charge * (1 + Math.random())) - defender.armor;
        attacker.charge = 0;
    }
};

module.exports = calculator;