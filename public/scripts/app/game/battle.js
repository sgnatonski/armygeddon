var Game = Game || {};

Game.Battle = function () {	
};

Game.Battle.prototype.load = function(){
	return Game.fetch().get('/battle')
  	.then(data => {
		var armies = Object.keys(data.armies).map(key => data.armies[key]);
		this.firstArmy = new Game.Army(armies[0], data.unitTypes);
		this.secondArmy = new Game.Army(armies[1], data.unitTypes);
		this.terrain = data.terrain;
		this.unitQueue = data.turns[0].readyUnits;    
  	});
}

Game.Battle.prototype.getTerrain = function() {
	return this.terrain;
};

Game.Battle.prototype.getUnits = function() {
	return this.firstArmy.getArmy().concat(this.secondArmy.getArmy());
};

Game.Battle.prototype.nextUnit = function() {
	return this.getUnits().find(u => u.id == this.unitQueue[0]);
};

Game.Battle.prototype.getArmy = function(unitId) {
	return this.firstArmy.getArmy().some(x => x.id == unitId)
	? this.firstArmy
	: this.secondArmy;
};

Game.Battle.prototype.unitMoving = function(unit, x, y, distance) {
	var army = this.getArmy(unit.id);

	return Game.fetch().post(`/battle/${army.playerId}/${unit.id}/move/${x}/${y}`)
	.then(data => {
		this.unitQueue = data.unitQueue;
		army.restoreUnit(data.currUnit);
		var nextUnitArmy = this.getArmy(data.nextUnit.id);
		nextUnitArmy.restoreUnit(data.nextUnit);
		return unit;
	});
};

Game.Battle.prototype.unitAttacking = function(unit, x, y) {
	var army = this.getArmy(unit.id);

	return Game.fetch().post(`/battle/${army.playerId}/${unit.id}/attack/${x}/${y}`)
	.then(data => {
		this.unitQueue = data.unitQueue;
		army.restoreUnit(data.currUnit);
		var nextUnitArmy = this.getArmy(data.nextUnit.id);
		nextUnitArmy.restoreUnit(data.nextUnit);
		return unit;
	});
};