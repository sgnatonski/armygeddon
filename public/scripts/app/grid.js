function initGrid(battle){ 
  function calculateSceneSize(terrain){
    var tx = terrain.map(x => x.x);
    var ty = terrain.map(x => x.y);
    var minX = Math.abs(Math.min(...tx));
    var maxX = Math.abs(Math.max(...tx));
    var minY = Math.abs(Math.min(...ty));
    var maxY = Math.abs(Math.max(...ty));
    var sceneSize = Math.max(...[minX, maxX, minY, maxY]);
    return sceneSize;
  } 

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

  function getPathInRange (sourceHex, targetHex, range) {
    var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y));
    var terrain = battle.getTerrain();
    var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
    var inRange = path.reduce((acc, curr) => {
      var accCost = acc.map(x => x.cost).reduce((a,b) => a + b, -sourceHex.cost);
      if (accCost + curr.cost <= range){
        acc.push(curr);
      }
      return acc;
    }, [sourceHex]);
    return inRange;
  }
  
  function hexSelected(hex) {
    return new Promise(function(resolve,reject){
      if (!grid.selectedHex){
        var unit = battle.nextUnit();
        var nextHex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
        setSelectedHex(nextHex.x, nextHex.y);
        resolve();
        return;
      }
      
      var selectedHex = grid.selectedHex;
      setSelectedHex();

      function resolveAction(results){
        var movedUnit = results[0];
        selectedHex.unit = null;
        selectedHex.blocked = false;
        var hex = grid.getHexAt(new BHex.Axial(movedUnit.pos.x, movedUnit.pos.y));
        hex.blocked = true;
        hex.unit = movedUnit;
        
        var nextUnit = battle.nextUnit();
        var nextHex = grid.getHexAt(new BHex.Axial(nextUnit.pos.x, nextUnit.pos.y));
        setSelectedHex(nextHex.x, nextHex.y);
        resolve();
      }

      if (selectedHex.unit.mobility > 0){        
        var path = getPathInRange(selectedHex, hex, selectedHex.unit.mobility);
        if (path.length){
          var unit = selectedHex.unit;
          var movePromise = battle.unitMoving(unit, hex.x, hex.y);
          var animPromise = selectedHex.unit.animatePath(unit.sceneNode, path);
          Promise.all([movePromise, animPromise]).then(resolveAction);
        }
      }
      else if (selectedHex.unit.attacks > 0 && hex.unit){
        var path = getPathInRange(selectedHex, hex, selectedHex.unit.range);
        if (path.length){
          var unit = selectedHex.unit;
          var movePromise = battle.unitAttacking(unit, hex.x, hex.y);
          //var animPromise = selectedHex.unit.animatePath(unit.sceneNode, path);
          Promise.all([movePromise/*, animPromise*/]).then(resolveAction);
        }
      }
    });
  };

  function getSelectedHexRange() {
    var range = [];
    if (grid.selectedHex && grid.selectedHex.unit){
      var range = grid.selectedHex.unit.mobility > 0
        ? grid.selectedHex.unit.mobility
        : grid.selectedHex.unit.range;
      var gridRange = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), range);
      var terrain = battle.getTerrain();
      range = gridRange.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
    }
    return range;
  };

  function getSelectedHexState() {
    if (grid.selectedHex && grid.selectedHex.unit){
      return grid.selectedHex.unit.mobility > 0
          ? 'move'
          : grid.selectedHex.unit.attacks > 0
            ? 'attack'
            : 'done';
    }
    return '';
  };

  function getPathFromSelectedHex(targetHex) {
    if (!grid.selectedHex || !grid.selectedHex.unit){
      return [];
    }
    var path = getPathInRange(grid.selectedHex, targetHex, grid.selectedHex.unit.mobility);
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

  var grid = new BHex.Grid(calculateSceneSize(battle.getTerrain()));

  battle.getUnits().forEach(unit => {
      var hex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
      hex.unit = attachUnitVisual(unit);
      hex.blocked = true;
  });

  battle.getTerrain().forEach(terrain => {
    grid.getHexAt(new BHex.Axial(terrain.x, terrain.y)).cost = terrain.cost;      
  });

  return {
    getHexes: getHexes,
    hexSelected: hexSelected,
    getSelectedHexRange: getSelectedHexRange,
    getSelectedHexState: getSelectedHexState,
    getPathFromSelectedHex: getPathFromSelectedHex,
    initDrawing: initDrawing
  }
}