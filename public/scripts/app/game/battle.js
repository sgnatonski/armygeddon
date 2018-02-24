var Game = Game || {};

Game.Battle = function (eventBus) {
	this.eventBus = eventBus;
	this.eventBus.on('update', d => this.onUpdate(d));
};

Game.Battle.prototype.getSceneSize = function(){
    var tx = this.terrain.map(x => x.x);
    var ty = this.terrain.map(x => x.y);
    var minX = Math.abs(Math.min(...tx));
    var maxX = Math.abs(Math.max(...tx));
    var minY = Math.abs(Math.min(...ty));
    var maxY = Math.abs(Math.max(...ty));
    var sceneSize = Math.max(...[minX, maxX, minY, maxY]);
    return sceneSize;
} 

Game.Battle.prototype.load = function(){
	var battleid = sessionStorage.getItem('battleid');
	var url = `/singlebattle/join/${battleid ? battleid : ''}`;
	return Game.fetch().post(url).then(data => {
		this.loadData(data);
		return Promise.resolve(this);
	});
}

Game.Battle.prototype.loadData = function(data){
	var armies = Object.keys(data.armies).map(key => data.armies[key]);
	sessionStorage.setItem('battleid', data.id);
	this.id = data.id;
	this.selfArmy = data.selfArmy;
	this.terrain = data.terrain;
	this.unitQueue = data.turns[data.turns.length - 1].readyUnits;
	this.firstArmy = new Game.Army(armies[0], data.unitTypes);
	if (armies.length == 2){
		this.secondArmy = new Game.Army(armies[1], data.unitTypes);	
		setTimeout(() => this.eventBus.publish('battlestarted'), 0);
	}
};

Game.Battle.prototype.getTerrain = function() {
	return this.terrain;
};

Game.Battle.prototype.getUnits = function() {
	if (!this.secondArmy){
		return this.firstArmy.getArmy();
	}
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

Game.Battle.prototype.getOtherArmy = function(unitId) {
	return this.firstArmy.getArmy().some(x => x.id == unitId)
	? this.secondArmy
	: this.firstArmy;
};

Game.Battle.prototype.onUpdate = function(data){
	if (this.isDefeatedArmy(data.currUnit.id)){
		alert('DEFEAT');
	}
	if (this.isWinningArmy(data.currUnit.id)){
		alert('VICTORY');
	}
	else { 
		this.eventBus.publish('unitdelta', {
			source: this.nextUnit().pos,
			target: data.currUnit.pos
		});

		this.unitQueue = data.unitQueue;
		var army = this.getArmy(data.currUnit.id);
		army.restoreUnit(data.currUnit);
		if (data.targetUnit){
			var targetArmy = this.getArmy(data.targetUnit.id);
			targetArmy.restoreUnit(data.targetUnit);
		}
		var nextUnitArmy = this.getArmy(data.nextUnit.id);
		nextUnitArmy.restoreUnit(data.nextUnit);
		this.eventBus.publish('battleupdated', data);
	}
};

Game.Battle.prototype.unitMoving = function(unit, x, y, distance) {	
	requestMove(this.eventBus, this.id, unit.id, x, y);
};

Game.Battle.prototype.unitTurning = function(unit, x, y) {
	requestTurn(this.eventBus, this.id, unit.id, x, y);
};

Game.Battle.prototype.unitAttacking = function(unit, x, y) {
	requestAttack(this.eventBus, this.id, unit.id, x, y);
};

Game.Battle.prototype.getUnitState = function(unit) {
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

Game.Battle.prototype.getUnitAt = function(x, y) {
	return this.getUnits().find(u => u.pos.x == x && u.pos.y == y);
};

Game.Battle.prototype.isWinningArmy = function(unitId) {
	var army = this.getOtherArmy(unitId);
	var stillAlive = army.units.some(u => u.endurance > 0);
	return !stillAlive;
}

Game.Battle.prototype.isDefeatedArmy = function(unitId) {
	var army = this.getArmy(unitId);
	var stillAlive = army.units.some(u => u.endurance > 0);
	return !stillAlive;
}

Game.Battle.prototype.isPlayerArmy = function(unitId) {
	return this.selfArmy === this.getArmy(unitId).playerId;
}