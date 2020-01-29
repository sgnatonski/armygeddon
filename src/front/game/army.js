var army = function (army, unitTypes) {
	this.playerId = army.id;
	this.playerName = army.name;
	this.unitTypes = unitTypes;
	this.units = Object.keys(army.units).map(key => army.units[key]);
};

army.prototype.getArmy = function () {
	return this.units;
};

army.prototype.restoreUnit = function(upd) {
	var unit = this.units.find(u => u.id == upd.id);
	Object.assign(unit, upd);
};

export default army;
