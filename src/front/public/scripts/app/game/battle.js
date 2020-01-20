var Game = Game || {};

Game.Battle = function (eventBus) {
	this.eventBus = eventBus;
	this.eventBus.on('update', d => this.onUpdate(d));
	this.eventBus.on('end', d => this.onEnd(d));
	this.battleState = 'none';
};

Game.Battle.prototype.getSceneSize = function(){
    return this.sceneSize;
} 

Game.Battle.prototype.load = function(){
	var battleid = sessionStorage.getItem('singlebattleid');
	var url = `/singlebattle/join/${battleid ? battleid : ''}`;
	return Game.fetch().post(url).then(data => {
		this.battleState = 'created';
		this.loadData(data, true);
		return Promise.resolve(this);
	});
}

Game.Battle.prototype.loadData = function(data, single){
	var armies = Object.keys(data.armies).map(key => data.armies[key]);
	sessionStorage.setItem(single ? 'singlebattleid' : 'battleid', data.id);
	this.id = data.id;
	this.selfArmy = data.selfArmy;
	this.terrain = data.terrain;
	this.sceneSize = data.sceneSize;
	this.unitQueue = data.turns[data.turns.length - 1].readyUnits;
	this.firstArmy = new Game.Army(armies[0], data.unitTypes);
	var bsTxt1 = this.getBattleStateText();
	setTimeout(() => this.eventBus.publish('battlestate', bsTxt1), 0);
	if (armies.length == 2){
		this.secondArmy = new Game.Army(armies[1], data.unitTypes);	
		this.battleState = 'ready';
		if (data.winningArmy){
			return this.onEnd(data);
		}
		var bsTxt2 = this.getBattleStateText();
		setTimeout(() => this.eventBus.publish('battlestarted'), 0);
		setTimeout(() => this.eventBus.publish('battlestate', bsTxt2), 0);
		var nextUnit = this.nextUnit();
		var nextPlayer = this.getArmy(nextUnit).playerName;
		setTimeout(() => this.eventBus.publish('battlestate', `${nextPlayer} ${nextUnit.type} unit is next to act`), 0);
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
	this.battleState = 'started';
	var delta = {
		source: this.nextUnit().pos,
		target: data.currUnit.pos
	};

	this.unitQueue = data.unitQueue;
	var army = this.getArmy(data.currUnit.id);
	army.restoreUnit(data.currUnit);
	if (data.targetUnit){
		var targetArmy = this.getArmy(data.targetUnit.id);
		targetArmy.restoreUnit(data.targetUnit);
	}
	var nextUnitArmy = this.getArmy(data.nextUnit.id);
	nextUnitArmy.restoreUnit(data.nextUnit);
	setTimeout(() => this.eventBus.publish('battleupdated', { delta: delta, data: data}), 0);
	setTimeout(() => this.eventBus.publish('battlestate', this.getBattleStateText()), 0);
	var nextUnit = this.nextUnit();
	var nextPlayer = this.getArmy(nextUnit).playerName;
	setTimeout(() => this.eventBus.publish('battlestate', `${nextPlayer} ${nextUnit.type} unit is next to act`), 0);
};

Game.Battle.prototype.onEnd = function(data){
	this.battleState = 'finished';
	setTimeout(() => this.eventBus.publish('battleended', this.getBattleSummary(data.battle)), 0);
	setTimeout(() => this.eventBus.publish('battlestate', this.getBattleStateText()), 0);
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

Game.Battle.prototype.isPlayerArmy = function(unitId, exactMatch) {
	if (exactMatch){
		return this.selfArmy === this.getArmy(unitId).playerId;
	}

	return this.selfArmy === this.getArmy(unitId).playerId
		|| '_' + this.selfArmy === this.getArmy(unitId).playerId
		|| this.selfArmy === '_' + this.getArmy(unitId).playerId;
}

Game.Battle.prototype.getBattleStateText = function() {
	if (this.battleState == 'none'){
		return '';
	}
	if (this.battleState == 'created'){
		return `Army of ${this.firstArmy.playerName} has arrived`;
	}
	if (this.battleState == 'ready'){
		return `Army of ${this.secondArmy.playerName} has arrived`;
	}
	if (this.battleState == 'started'){
		return `Army of ${this.firstArmy.playerName} is fighting with army of ${this.secondArmy.playerName}`;
	}
	if (this.battleState == 'finished'){
		return this.firstArmy.units.some(u => u.endurance > 0)
		? `Army of ${this.firstArmy.playerName} has won`
		: `Army of ${this.secondArmy.playerName} has won`
	}
};

Game.Battle.prototype.getBattleSummary = function(data) {
	var summary = [];
	if (this.battleState == 'finished'){
		summary.push(this.firstArmy.playerId == data.winningArmy
			? `Army of ${this.firstArmy.playerName} has won`
			: `Army of ${this.secondArmy.playerName} has won`);

		return summary;
	}
	return [];
};