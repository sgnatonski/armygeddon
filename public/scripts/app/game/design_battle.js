var Game = Game || {};

Game.DesignBattle = function () {
};

Game.DesignBattle.prototype.load = function(){
	return Game.fetch().get('/battle')
  	.then(data => {
		var armies = Object.keys(data.armies).map(key => data.armies[key]);
		this.firstArmy = new Game.Army(armies[0], data.unitTypes);
		this.secondArmy = new Game.Army(armies[1], data.unitTypes);
		this.terrain = data.terrain;
		this.unitQueue = data.turns[data.turns.length - 1].readyUnits;    
  	});
}

Game.DesignBattle.prototype.getSceneSize = function(){
    return 50;
};

Game.DesignBattle.prototype.getTerrain = function() {
	return this.terrain;
};

Game.DesignBattle.prototype.getUnits = function() {
	return this.firstArmy.getArmy().concat(this.secondArmy.getArmy());
};

Game.DesignBattle.prototype.nextUnit = function() {
	return this.getUnits().find(u => u.id == this.unitQueue[0]);
};

Game.DesignBattle.prototype.getArmy = function(unitId) {
	return this.firstArmy.getArmy().some(x => x.id == unitId)
	? this.firstArmy
	: this.secondArmy;
};

Game.DesignBattle.prototype.getUnitState = function(unit) {
	if (!unit){
		return 'none';
	}
	if (unit.endurance <= 0){
		return 'dead';
	}
	if (unit.mobility > 0){
		return 'moving';
	}
	if (unit.agility > 0){
		return 'turning';
	}
	if (unit.attacks > 0){
		return 'attacking';
	}
};

Game.DesignBattle.prototype.getUnitAt = function(x, y) {
	return this.getUnits().find(u => u.pos.x == x && u.pos.y == y);
};
