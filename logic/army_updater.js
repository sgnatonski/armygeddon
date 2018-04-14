module.exports = (army, experience) => {
    experience.forEach(u => {
        var unit = army.units.find(x => x.id == u.unitId);
        unit.experience += u.expGain;
    });
}