var Game = Game || {};

Game.DesignBattle = function () {
};

Game.DesignBattle.prototype.getSceneSize = function(){
    var tx = this.terrain.map(x => x.x);
    var ty = this.terrain.map(x => x.y);
    var minX = Math.abs(Math.min(...tx));
    var maxX = Math.abs(Math.max(...tx));
    var minY = Math.abs(Math.min(...ty));
    var maxY = Math.abs(Math.max(...ty));
    var sceneSize = Math.max(...[minX, maxX, minY, maxY]);
    return sceneSize;
} 

Game.DesignBattle.prototype.load = function(){
	return Game.fetch().get('/battle')
  	.then(data => {
        this.terrain = [];
        var radius = 20;
        for (var x = -radius; x <= radius; x++)
            for (var y = -radius; y <= radius; y++)
                for (var z = -radius; z <= radius; z++)
                    if (x + y + z == 0)
                        this.terrain.push( { x: x, y: y, cost: 1 });
		this.unitQueue = [];    
  	});
}

Game.DesignBattle.prototype.getTerrain = function() {
	return this.terrain;
};

Game.DesignBattle.prototype.getUnits = function() {
	return [];
};

Game.DesignBattle.prototype.nextUnit = function() {
	return { pos: { x: 0, y: 0 } };
};

Game.DesignBattle.prototype.getArmy = function(unitId) {
	return undefined;
};

Game.DesignBattle.prototype.getUnitState = function(unit) {
	return 'none';
};

Game.DesignBattle.prototype.getUnitAt = function(x, y) {
	return undefined;
};
