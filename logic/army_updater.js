module.exports = (army, experience) => {
    experience.forEach(u => {
        var unit = army.units.find(x => x.id == u.unitId);
        unit.experience = unit.experience || 0;
        unit.experience += u.expGain;
    });
}