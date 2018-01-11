var calculator = {
    applyAttackDamage: (attacker, defender) => {
        defender.endurance -= attacker.damage;
    },
    applyRangeDamage: (attacker, defender) => {
        defender.endurance -= attacker.damage * (1 + Math.random());
    },
    applyChargeDamage: (attacker, defender) =>{
        defender.endurance -= attacker.damage + (attacker.charge * (1 + Math.random()));
        attacker.charge = 0;
    }
};

module.exports = calculator;