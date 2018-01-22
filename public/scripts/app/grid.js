function initGrid(battle, animator){
  function setSelectedHex (x, y) {
    var selectedHex = grid.selectedHex;  
    grid.selectedHex = null;
    if (x != undefined && y != undefined){
      var hex = grid.getHexAt(new BHex.Axial(x, y));
      if (hex !== selectedHex){
        grid.selectedHex = hex;   
      }
    }
  }

  function getMoveCost(sourceHex, targetHex, range){
    var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y));
    var terrain = battle.getTerrain();
    var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
    var cost = path.map(x => x.cost).reduce((a,b) => a + b);
    return cost;
  }

  function getPathInRange (sourceHex, targetHex, range, ignoreInertia) {
    var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
    var terrain = battle.getTerrain();
    var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
    var inRange = path.reduce((acc, curr) => {
      var accCost = acc.map(x => x.cost).reduce((a,b) => a + b, -sourceHex.cost);
      if (ignoreInertia || accCost + curr.cost <= range){
        acc.push(curr);
      }
      return acc;
    }, [sourceHex]);
    return inRange;
  }
  
  function hexSelected(hex) {
    return new Promise(function(resolve,reject){      
      var selectedHex = grid.selectedHex;
      
      function resolveAction(results){
        var movedUnit = results[0];
        if (battle.isDefeatedArmy(movedUnit.id)){
          alert('DEFEAT');
        }
        if (battle.isWinningArmy(movedUnit.id)){
          alert('VICTORY');
        }
        var hex = grid.getHexAt(new BHex.Axial(movedUnit.pos.x, movedUnit.pos.y));
        selectedHex.blocked = false;
        hex.blocked = true;
        
        var nextUnit = battle.nextUnit();
        var nextHex = grid.getHexAt(new BHex.Axial(nextUnit.pos.x, nextUnit.pos.y));
        setSelectedHex(nextHex.x, nextHex.y);
        resolve(nextHex);
      }

      var unit = grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null;
      setSelectedHex();

      var unitState = battle.getUnitState(unit);
      switch(unitState){
        case 'moving': 
          var path = getPathInRange(selectedHex, hex, unit.mobility);
          var lastStep = path[path.length - 1];
          if (lastStep.x == hex.x && lastStep.y == hex.y){
            var movePromise = battle.unitMoving(unit, hex.x, hex.y);
            var animPromise = animator.getAnimation(unit.id, path);
            Promise.all([movePromise, animPromise]).then(resolveAction);
          }
          break;
        case 'turning':
          var movePromise = battle.unitTurning(unit, hex.x, hex.y);
          Promise.all([movePromise]).then(resolveAction);
          break;
        case 'attacking':
          var path = getPathInRange(selectedHex, hex, unit.range, true);
          var lastStep = path[path.length - 1];
          if (lastStep.x == hex.x && lastStep.y == hex.y){
            var movePromise = battle.unitAttacking(unit, hex.x, hex.y);
            Promise.all([movePromise]).then(resolveAction);
          }
          break;
        default:
          var unit = battle.nextUnit();
          var nextHex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
          setSelectedHex(nextHex.x, nextHex.y);
          resolve(nextHex);
          break;
      }
    });
  };

  function getTurnCoords(){
    return [
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: -1, y: 1},
      {x: -1, y: 0},
      {x: 0, y: -1},
      {x: 1, y: -1},
    ];
  }

  function getTurnAngle(unit) {
    var turns = getTurnCoords();

    var dir = unit.directions[0];
    
    var t = [turns[dir - 1]];
    for (var i = 1; i <= unit.agility; i++){
      var n1 = dir - 1 - i;
      if (n1 < 0){
        n1 = turns.length + n1;
      }
      var n2 = dir - 1 + i;
      if (n2 > turns.length - 1){
        n2 = n2 - turns.length;
      }
      t.push(turns[n1]);
      t.push(turns[n2]);
    }
    return t;
  }

  function getSelectedHexRange() {
    var unit = grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null;
    if (unit){
      var state = battle.getUnitState(unit);
      var gridRange = [];
      if (state == 'moving'){
        gridRange = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.mobility);
        //var turns = getTurnCoords();
        //var dir = unit.directions[0];    
        //var t = turns[dir - 1];
        //var chargePos = { 
        //  x: unit.pos.x + t.x,
        //  y: unit.pos.y + t.y
        //};
        //gridRange = gridRange.concat(grid.getRange(new BHex.Axial(chargePos.x, chargePos.y), unit.mobility - 1));
        //gridRange = [...new Set(gridRange)];
      }
      else if (state == 'turning'){
        gridRange = getTurnAngle(unit).map(a => grid.getHexAt(new BHex.Axial(unit.pos.x + a.x, unit.pos.y + a.y)));
      }
      else{
        gridRange = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.range, true);    
      }

      var terrain = battle.getTerrain();
      return gridRange.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));        
    }
    return [];
  };

  function getSelectedHexState(){
    return battle.getUnitState(grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null);
  }

  function getPathFromSelectedHex(targetHex) {
    var unit = grid.selectedHex ? battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y) : null;
    if (!unit){
      return [];
    }
    var path = getPathInRange(grid.selectedHex, targetHex, unit.mobility);
    return path;
  };

  function initDrawing(center) {
    var sideWidth = 30;
    var options = new BHex.Drawing.Options(sideWidth, BHex.Drawing.Static.Orientation.PointyTop, new BHex.Drawing.Point(center.x, center.y));
    BHex.Drawing.Drawing(grid, options);  
  };

  function getHexes(){
    return battle.getTerrain().map(t => grid.hexes.find(h => t.x == h.x && t.y == h.y));
  };

  function getUnits(){
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
    getArmyId: (unitId) => battle.getArmy(unitId).playerId,
    hexSelected: hexSelected,
    getSelectedHexRange: getSelectedHexRange,
    getSelectedHexState: getSelectedHexState,
    getPathFromSelectedHex: getPathFromSelectedHex,
    getSelectedHexMoveCost: (x, y) => grid.selectedHex ? getMoveCost(grid.selectedHex, grid.getHexAt(new BHex.Axial(x, y)), battle.getUnitAt(grid.selectedHex.x, grid.selectedHex.y)) : null,
    initDrawing: initDrawing
  }
}