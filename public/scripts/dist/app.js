function Animator(){
    var anims = [];
    var c;
    var currentAnimation;

    return {
        registerAnimation: (id, node, center) => {
            anims[id] = node;
            c = center;
        },
        getAnimation: (id, path) => {
            currentAnimation = getUnitMoveAnim(path, anims[id], c).then(() => currentAnimation = null);
            return currentAnimation;
        },
        isAnimating: () =>{
            return currentAnimation;
        }
    }
};
function Damage(){
    var turns = [
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 1},
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: -1},
    ];
    
    var directions = (unitX, unitY, x, y) =>{
        var diffX = x - unitX;
        var diffY = y - unitY;
        var direction = turns.findIndex(t => t.x == diffX && t.y == diffY) + 1;
        return direction;
    };

    return {
        getRangeDamage: (attacker, defender) => {
            var dmg = attacker.damage + (attacker.charge / 2) - defender.armor;
            var distance = Math.max(...[Math.abs(attacker.pos.x - defender.pos.x), Math.abs(attacker.pos.y - defender.pos.y)]);
            var defenseDirection = directions(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
            var dirDefense = defender.directions.some(d => d == defenseDirection);
    
            if (distance == 1 || dirDefense){
                distance = attacker.range * 2;
            }
            var distanceDamage = Math.floor(dmg * attacker.range / distance);
            return distanceDamage;
        },
        getChargeDamage: (attacker, defender) => {
            var charge = Math.pow(attacker.charge - 1, 2);
            var attackDirection = directions(attacker.pos.x, attacker.pos.y, defender.pos.x, defender.pos.y);
            var defenseDirection = directions(defender.pos.x, defender.pos.y, attacker.pos.x, attacker.pos.y);
            var dirAttack = attacker.directions.some(d => d == attackDirection);
            var dirDefense = defender.directions.some(d => d == defenseDirection);
    
            if (dirAttack && attacker.directions[0] == defender.directions[0]){
                charge = charge * 2;
            }
            
            if (charge < 0 || !dirAttack){
                charge = 0;
            }
            var armor = dirDefense ? defender.armor : 0;
            var dmg = attacker.damage + charge - armor;
            return dmg;
        }
    };
};
function EventBus(){
    var events = {};
    return {
        on: (eventName, callback) => {
          if (!events[eventName]){
            events[eventName] = [];
          }
          events[eventName].push(callback);
        },
        publish: (eventName, data) => {
          if (events[eventName]){
            events[eventName].forEach(cb => cb(data));
          }
        }
    };    
}
function initGrid(battle) {
  function setSelectedHex(x, y) {
    var selectedHex = grid.selectedHex;
    grid.selectedHex = null;
    if (x != undefined && y != undefined) {
      var hex = grid.getHexAt(new BHex.Axial(x, y));
      grid.selectedHex = hex;
    }
  }

  function getMoveCost(sourceHex, targetHex, range) {
    var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y));
    var terrain = battle.getTerrain();
    var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y)) || [];
    var cost = path.map(x => x.cost).reduce((a, b) => a + b, []);
    return cost;
  }

  function getPathInRange(sourceHex, targetHex) {
    var unit = battle.getUnitAt(sourceHex.x, sourceHex.y);
    if (!unit) {
      var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
      var terrain = battle.getTerrain();
      var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));

      return [sourceHex].concat(path);
    }
    else {
      var range;
      var ignoreInertia;
      var unitState = battle.getUnitState(unit);

      switch (unitState) {
        case 'moving':
          range = unit.mobility;
          break;
        case 'attacking':
          range = unit.range;
          ignoreInertia = true;
          break;
      }
      var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
      var terrain = battle.getTerrain();
      var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));

      var inRange = path.reduce((acc, curr) => {
        var accCost = acc.map(x => x.cost).reduce((a, b) => a + b, -sourceHex.cost);
        if (ignoreInertia || accCost + curr.cost <= range) {
          acc.push(curr);
        }
        return acc;
      }, [sourceHex]);
      return inRange;
    }
  }

  function updateSelection(unit) {
    var hex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
    hex.blocked = true;

    var nextUnit = battle.nextUnit();
    var nextHex = grid.getHexAt(new BHex.Axial(nextUnit.pos.x, nextUnit.pos.y));
    setSelectedHex(nextHex.x, nextHex.y);
    return nextHex;
  }

  function hexSelected(hex) {
    var selectedHex = grid.selectedHex;
    if (selectedHex) {
      selectedHex.blocked = false;
    }
    var unit = grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null;

    var unitState = battle.getUnitState(unit);
    switch (unitState) {
      case 'moving':
        var path = getPathInRange(selectedHex, hex);
        var lastStep = path[path.length - 1];
        if (lastStep.x == hex.x && lastStep.y == hex.y) {
          battle.unitMoving(unit, hex.x, hex.y);
        }
        break;
      case 'turning':
        battle.unitTurning(unit, hex.x, hex.y);
        break;
      case 'attacking':
        var path = getPathInRange(selectedHex, hex, unit.range, true);
        var lastStep = path[path.length - 1];
        if (lastStep.x == hex.x && lastStep.y == hex.y) {
          battle.unitAttacking(unit, hex.x, hex.y);
        }
        break;
      default:
        var unit = battle.nextUnit();
        if (unit) {
          var nextHex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
          setSelectedHex(nextHex.x, nextHex.y);
        }
        break;
    }
  };

  function getTurnCoords() {
    return [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
    ];
  }

  function getTurnAngle(unit) {
    var turns = getTurnCoords();

    var dir = unit.directions[0];

    var t = [turns[dir - 1]];
    for (var i = 1; i <= unit.agility; i++) {
      var n1 = dir - 1 - i;
      if (n1 < 0) {
        n1 = turns.length + n1;
      }
      var n2 = dir - 1 + i;
      if (n2 > turns.length - 1) {
        n2 = n2 - turns.length;
      }
      t.push(turns[n1]);
      t.push(turns[n2]);
    }
    return t;
  }

  function getSelectedHexRange() {
    var unit = grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null;
    if (unit) {
      var state = battle.getUnitState(unit);
      var gridRange = [];
      if (state == 'moving') {
        gridRange = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.mobility);
      }
      else if (state == 'turning') {
        gridRange = getTurnAngle(unit).map(a => grid.getHexAt(new BHex.Axial(unit.pos.x + a.x, unit.pos.y + a.y)));
      }
      else {
        gridRange = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.range, true);
      }

      var terrain = battle.getTerrain();
      return gridRange.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
    }
    return [];
  };

  function getSelectedHexState() {
    return battle.getUnitState(grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null);
  }

  function getPathBetween(sourceHex, targetHex) {
    return getPathInRange(sourceHex, targetHex);
  };

  function initDrawing(center) {
    var sideWidth = 30;
    var options = new BHex.Drawing.Options(sideWidth, BHex.Drawing.Static.Orientation.PointyTop, new BHex.Drawing.Point(center.x, center.y));
    BHex.Drawing.Drawing(grid, options);
  };

  function getHexes() {
    return battle.getTerrain().map(t => grid.hexes.find(h => t.x == h.x && t.y == h.y));
  };

  function getUnits() {
    return battle.getUnits();
  }

  var grid = new BHex.Grid(battle.getSceneSize());

  battle.getUnits().forEach(unit => {
    var hex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
    hex.blocked = true;
  });

  battle.getTerrain().forEach(terrain => {
    grid.getHexAt(new BHex.Axial(terrain.x, terrain.y)).cost = terrain.cost;
  });

  return {
    getHexes: getHexes,
    getSelectedHex: () => grid.selectedHex ? grid.getHexAt(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y)) : null,
    getHexAt: (x, y) => grid.getHexAt(new BHex.Axial(x, y)),
    getUnitAt: (x, y) => battle.getUnitAt(x, y),
    getUnits: getUnits,
    isPlayerArmy: (unitId, exactMatch) => battle.isPlayerArmy(unitId, exactMatch),
    hexSelected: hexSelected,
    getSelectedHexRange: getSelectedHexRange,
    getSelectedHexState: getSelectedHexState,
    getPathBetween: getPathBetween,
    getSelectedHexMoveCost: (x, y) => grid.selectedHex ? getMoveCost(grid.selectedHex, grid.getHexAt(new BHex.Axial(x, y)), battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y)) : null,
    initDrawing: initDrawing,
    updateSelection: updateSelection
  }
}
function setupStage(grid, eventBus, images) {
  var container = document.getElementById('container');
  var width = container.clientWidth;
  var height = window.innerHeight - container.offsetTop;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  window.addEventListener('resize', event => {
    stage.width(container.clientWidth);
    stage.height(window.innerHeight - container.offsetTop);
    waitLayer.node.draw();
  });

  grid.initDrawing(center);

  var animator = new Animator();

  var effectLayer = createEffectLayer(center);
  var unitLayer = createUnitLayer(center, grid, animator);
  var hlLayer = createHighlightLayer(center);
  var terrainLayer = createTerrainLayer();
  var tooltipLayer = createTooltipLayer(stage);
  var waitLayer = createWaitLayer(width, height);

  waitLayer.show('Sir,\nYou\'re first on the battlefield.\n\nHopefully the other army will arrive soon.');

  eventBus.on('battlestarted', () => {
    waitLayer.hide();
  });

  eventBus.on('battleended', result => {
    grid = initGrid(result.battle);
    grid.initDrawing(center);
    hlLayer.highlightNode(null);
    effectLayer.drawPath([]);
    hlLayer.highlightRange([], grid.getSelectedHexState());
    grid.hexSelected(hex);
    unitLayer.refresh();
    tooltipLayer.hideTooltip();
    waitLayer.show('Battle has ended');
  });

  eventBus.on('battlestate', txt => {
    console.log(txt);
  });

  eventBus.on('battleupdated', u => {
    var animationPath = grid.getPathBetween(grid.getHexAt(u.delta.source.x, u.delta.source.y), grid.getHexAt(u.delta.target.x, u.delta.target.y));
    animator.getAnimation(u.data.currUnit.id, animationPath).then(() => {
      var nextHex = grid.updateSelection(u.data.currUnit);
      if (grid.isPlayerArmy(u.data.nextUnit.id)) {
        hlLayer.highlightNode(nextHex);
        hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      }
      unitLayer.refresh();
    });
  });

  var touchStartX;
  var touchStartY;
  stage.on('touchstart', evt =>{
    touchStartX = -stage.getX() + evt.evt.touches[0].clientX;
    touchStartY = -stage.getY() + evt.evt.touches[0].clientY;
  });

  stage.on('touchmove', evt =>{
    stage.setX(-(touchStartX - evt.evt.touches[0].clientX));
    stage.setY(-(touchStartY - evt.evt.touches[0].clientY));
    cullView();
    stage.batchDraw();
  });

  function cullView() {
    var zoomLevel = 1;
    var degreePixels = 0;

    var boundingX = ((-1 * (stage.x() * (1/zoomLevel)))-(window.innerWidth/2))-degreePixels;
    var boundingY = ((-1 * (stage.y() * (1/zoomLevel)))-(window.innerHeight/2))-degreePixels;
    var boundingWidth = (2 * window.innerWidth * (1/zoomLevel)) + (2*degreePixels);
    var boundingHeight = (2 * window.innerHeight * (1/zoomLevel)) + (2*degreePixels);
    var x = 0;
    var y = 0;
    var c  = terrainLayer.children;
    for (var i = 0; i < c.length; i++) {
        x = c[i].getX();
        y = c[i].getY();
        if (((x > boundingX) && (x < (boundingX + boundingWidth))) && ((y > boundingY) && (y < (boundingY + boundingHeight)))) {
            if (!c[i].visible()) {
                c[i].show();
            }
        } else {
            c[i].hide();
        }
    }
  }

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click dbltap', () => {
      hlLayer.highlightNode(null);
      effectLayer.drawPath([]);
      hlLayer.highlightRange([], grid.getSelectedHexState());
      grid.hexSelected(hex);
    });

    node.on('mouseenter', () => {
      if (animator.isAnimating()) {
        return;
      }
      var aUnit = null;
      var selHex = grid.getSelectedHex();
      if (selHex) {
        aUnit = grid.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = grid.getUnitAt(hex.x, hex.y);
      var state = grid.getSelectedHexState();

      if (grid.isPlayerArmy(aUnit.id)) {
        hlLayer.highlightNode(hex);
        effectLayer.drawPath(grid.getPathBetween(grid.getSelectedHex(), hex));
        hlLayer.highlightRange(grid.getSelectedHexRange(), state);
      }

      if (state == 'moving' || state == 'turning') {
        if (aUnit && tUnit) {
          tooltipLayer.updateTooltipWithUnitStats(tUnit);
        }
        else if (!tUnit) {
          var cost = grid.getSelectedHexMoveCost(hex.x, hex.y);
          tooltipLayer.updateTooltipWithMoveStats(aUnit, cost);
        }
      }
      else if (state == 'attacking') {
        if (aUnit && tUnit) {
          tooltipLayer.updateTooltipWithAttackStats(aUnit, tUnit);
        }
      }
    });

    node.on('mouseleave', () => {
      if (animator.isAnimating()) {
        return;
      }
      hlLayer.highlightNode(null);
      tooltipLayer.hideTooltip();
    });

    node.add(createHexCoordVisual(hex, center));

    return node;
  }

  terrainLayer.addGridNodes(grid, addNode);
  container.style.minHeight = terrainLayer.getHeight() + 'px';

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(effectLayer);
  stage.add(unitLayer.node);
  stage.add(tooltipLayer.node);
  stage.add(waitLayer.node);

  grid.hexSelected();
  var selHex = grid.getSelectedHex();
  if (!selHex) {
    return;
  }
  var unit = grid.getUnitAt(selHex.x, selHex.y);
  if (grid.isPlayerArmy(unit.id)) {
    hlLayer.highlightNode(selHex);
    hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
  }

  Konva.pixelRatio = 1;
}
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
	this.battleState = 'created';
	var bsTxt1 = this.getBattleStateText();
	setTimeout(() => this.eventBus.publish('battlestate', bsTxt1), 0);
	if (armies.length == 2){
		this.secondArmy = new Game.Army(armies[1], data.unitTypes);	
		this.battleState = 'ready';
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
	this.eventBus.publish('battleupdated', { delta: delta, data: data});
	this.eventBus.publish('battlestate', this.getBattleStateText());
	var nextUnit = this.nextUnit();
	var nextPlayer = this.getArmy(nextUnit).playerName;
	setTimeout(() => this.eventBus.publish('battlestate', `${nextPlayer} ${nextUnit.type} unit is next to act`), 0);
};

Game.Battle.prototype.onEnd = function(data){
	this.battleState = 'finished';
	this.eventBus.publish('battleended', data);
	this.eventBus.publish('battlestate', this.getBattleStateText());
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
var defaultHeaders = { 'Content-Type': 'application/json' };
var fetchOpts = {
    get: {
        method: 'GET',
        credentials: 'include',
        defaultHeaders
    },
    post: {
        method: 'POST',
        credentials: 'include',
        defaultHeaders
    }
}

var Game = Game || {};

Game.fetch = function () {
    return { 
        get: url => fetch(url, fetchOpts.get)
            .then(response => response.text())
            .then(json => JSON.parse(json)),
        post: (url, body) => {
            var opts = body 
            ? Object.assign({}, fetchOpts.post, { 
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            : fetchOpts.post;
            
            return fetch(url, opts)
                .then(response => response.text())
                .then(json => JSON.parse(json));
        }
            
    };	
};