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

function initScene(battle){  
    var grid = new BHex.Grid(calculateSceneSize(battle.getTerrain()));
    grid.setSelectedHex = (x, y) => {
      var selectedHex = grid.selectedHex;
      if (selectedHex){
        selectedHex.sceneNode.resetFill();
        selectedHex.sceneNode.resetBorder();
      }
  
      grid.selectedHex = null;

      if (x != undefined && y != undefined){
        var hex = grid.getHexAt(new BHex.Axial(x, y));
        if (hex.sceneNode && hex !== selectedHex){
          grid.selectedHex = hex;
          hex.sceneNode.setSelectedFill();   
          hex.sceneNode.setSelectedBorder();      
        }
      }
    }
  
    grid.isHexSelected = (hex) => grid.selectedHex == hex;
  
    grid.highlightedhexes = [];
  
    grid.hexSelected = (hex) => {
      var selectedHex = grid.selectedHex;
      if (selectedHex.unit.mobility > 0){        
        var path = grid.getPathInRange(selectedHex, hex, selectedHex.unit.mobility);
        if (path.length){
          var unit = selectedHex.unit;
          var movePromise = battle.unitMoving(unit, hex.x, hex.y);
          var animPromise = selectedHex.unit.animatePath(unit.sceneNode, path);
          grid.setSelectedHex();
          Promise.all([movePromise, animPromise]).then(values => {
            var movedUnit = values[0];
            selectedHex.unit = null;
            selectedHex.blocked = false;
            var hex = grid.getHexAt(new BHex.Axial(movedUnit.pos.x, movedUnit.pos.y));
            hex.blocked = true;
            hex.unit = movedUnit;
            
            var nextUnit = battle.nextUnit();
            var nextHex = grid.getHexAt(new BHex.Axial(nextUnit.pos.x, nextUnit.pos.y));
            grid.setSelectedHex(nextHex.x, nextHex.y);
            nextHex.sceneNode.fire('mouseover');
          });
        }
      }
      else if (selectedHex.unit.attacks > 0 && hex.unit){
        var path = grid.getPathInRange(selectedHex, hex, selectedHex.unit.range);
        if (path.length){
          var unit = selectedHex.unit;
          var movePromise = battle.unitAttacking(unit, hex.x, hex.y);
          //var animPromise = selectedHex.unit.animatePath(unit.sceneNode, path);
          grid.setSelectedHex();
          Promise.all([movePromise/*, animPromise*/]).then(values => {
            var movedUnit = values[0];
            selectedHex.unit = null;
            selectedHex.blocked = false;
            var hex = grid.getHexAt(new BHex.Axial(movedUnit.pos.x, movedUnit.pos.y));
            hex.blocked = true;
            hex.unit = movedUnit;
            
            var nextUnit = battle.nextUnit();
            var nextHex = grid.getHexAt(new BHex.Axial(nextUnit.pos.x, nextUnit.pos.y));
            grid.setSelectedHex(nextHex.x, nextHex.y);
            nextHex.sceneNode.fire('mouseover');
          });
        }
      }
    };
  
    grid.highlightSelectedUnitRange = () => {
      var highlightedHexes = grid.highlightedhexes || [];
      grid.highlightedhexes.forEach(h => {
        h.sceneNode.resetFill();
      });   
      grid.highlightedhexes = [];
  
      if (grid.selectedHex && grid.selectedHex.unit){
        var range = grid.selectedHex.unit.mobility > 0
          ? grid.selectedHex.unit.mobility
          : grid.selectedHex.unit.range;
        var range = grid.getRange(new BHex.Axial(grid.selectedHex.x, grid.selectedHex.y), range);
        for (var i = 0; i < range.length; i++){
          if (range[i].sceneNode){
            grid.highlightedhexes.push(range[i]);
            if (grid.selectedHex.unit.mobility > 0){
              range[i].sceneNode.setHighlightedMoveFill();
            }
            else{
              range[i].sceneNode.setHighlightedAttackFill();
            }
          }
        }
      }

      var changedHexes = grid.highlightedhexes.filter(i => highlightedHexes.indexOf(i) < 0)
        .concat(highlightedHexes.filter(i => grid.highlightedhexes.indexOf(i) < 0));

      return changedHexes;
    };

    grid.getMoveLinePoints = (hex, center) => {
      if (!grid.selectedHex || !grid.selectedHex.unit){
        return [];
      }
      var path = grid.getPathInRange(grid.selectedHex, hex, grid.selectedHex.unit.mobility);
      var linepoints = path.map(h => h.center).reduce((acc, curr) => acc.concat([center.x + curr.x, center.y + curr.y]), []);
      return linepoints;
    }

    grid.hexHover = (hex) => {
      if (!grid.isHexSelected(hex)){
        hex.sceneNode.setHoverFill();
      }
    };
  
    grid.hexHoverEnd = (hex) => {
      if (grid.selectedHex){
        if (grid.highlightedhexes.indexOf(hex) == -1){
          hex.sceneNode.resetFill();
          hex.sceneNode.resetBorder();
        }
        else if (!grid.isHexSelected(hex)){
          if (grid.selectedHex.unit.mobility > 0){
            hex.sceneNode.setHighlightedMoveFill();
          }
          else{
            hex.sceneNode.setHighlightedAttackFill();
          }
        }
      }
      else if (!grid.isHexSelected(hex)){
        hex.sceneNode.resetFill();
        hex.sceneNode.resetBorder();
      }
    };

    grid.getPathInRange = (sourceHex, targetHex, range) => {
      var path = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y));
      var inRange = path.reduce((acc, curr) => {
        var accCost = acc.map(x => x.cost).reduce((a,b) => a + b, -sourceHex.cost);
        if (accCost + curr.cost <= range){
          acc.push(curr);
        }
        return acc;
      }, [sourceHex]);
      return inRange;
    };

    grid.initDrawing = function(center){
      var sideWidth = 30;
      var options = new BHex.Drawing.Options(sideWidth, BHex.Drawing.Static.Orientation.PointyTop, new BHex.Drawing.Point(center.x, center.y));
      BHex.Drawing.Drawing(grid, options);  
    }

    battle.getUnits().forEach(unit => {
        var hex = grid.getHexAt(new BHex.Axial(unit.pos.x, unit.pos.y));
        hex.unit = attachUnitVisual(unit);
        hex.blocked = true;
    });
    
    battle.getTerrain().forEach(terrain => {
      grid.getHexAt(new BHex.Axial(terrain.x, terrain.y)).cost = terrain.cost;      
    });

    return grid;
  }