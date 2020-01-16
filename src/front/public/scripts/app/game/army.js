var Game = Game || {};

Game.Army = function (army, unitTypes) {
	this.playerId = army.id;
	this.playerName = army.name;
	this.unitTypes = unitTypes;
	this.units = Object.keys(army.units).map(key => army.units[key]);
};

Game.Army.prototype.getArmy = function () {
	return this.units;
};

Game.Army.prototype.restoreUnit = function(upd) {
	var unit = this.units.find(u => u.id == upd.id);
	Object.assign(unit, upd);
};
