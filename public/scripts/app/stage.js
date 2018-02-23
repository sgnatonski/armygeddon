function setupStage(grid, eventBus, animator, images){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  window.addEventListener('resize', function(event){
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
  });

  var effectLayer = createEffectLayer(center);
  var unitLayer = createUnitLayer(center, animator);
  var hlLayer = createHighlightLayer(center);
  var terrainLayer = createTerrainLayer();
  var tooltipLayer = createTooltipLayer(stage);

  grid.initDrawing(center);

  grid.getUnits().forEach(unit => {
    var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
    var armyId = grid.getArmyId(unit.id);
    unitLayer.addUnit(unit, hex.center, armyId);
  });
  
  var path = null;

  eventBus.on('battleupdated', data => {
    animator.getAnimation(data.currUnit.id, path).then(() => {
      var nextHex = grid.updateSelection(data.currUnit);
      hlLayer.highlightNode(nextHex);
      hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      unitLayer.refresh(grid.getUnits());
    });
  });

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click', () => {
      hlLayer.highlightNode(null);
      effectLayer.drawPath([]);
      hlLayer.highlightRange([], grid.getSelectedHexState());
      path = grid.getPathBetween(grid.getSelectedHex(), hex);
      grid.hexSelected(hex);
    });

    node.on('mouseenter', () => {
      if (animator.isAnimating()){
        return;
      }
      var state = grid.getSelectedHexState();
      hlLayer.highlightNode(hex);
      effectLayer.drawPath(grid.getPathBetween(grid.getSelectedHex(), hex));
      hlLayer.highlightRange(grid.getSelectedHexRange(), state);
      var aUnit = null;
      var selHex = grid.getSelectedHex();
      if (selHex){
        aUnit = grid.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = grid.getUnitAt(hex.x, hex.y);

      if (state == 'moving' || state == 'turning'){
        if (aUnit && tUnit){
          tooltipLayer.updateTooltipWithUnitStats(tUnit);
        }
        else if (!tUnit){
          var cost = grid.getSelectedHexMoveCost(hex.x, hex.y);  
          tooltipLayer.updateTooltipWithMoveStats(aUnit, cost);
        }
      }
      else if (state == 'attacking'){        
        if (aUnit && tUnit){
          tooltipLayer.updateTooltipWithAttackStats(aUnit, tUnit);
        }
      }
    });
    
    node.on('mouseleave', () => {
      if (animator.isAnimating()){
        return;
      }
      hlLayer.highlightNode(null);
      tooltipLayer.hideTooltip();
    });

    return {
      node: node,
      coord: createHexCoordVisual(hex, center)
    }
  }
  
  terrainLayer.addGridNodes(grid, addNode);

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(effectLayer);
  stage.add(unitLayer.node);
  stage.add(tooltipLayer.node);

  grid.hexSelected();
  hlLayer.highlightNode(grid.getSelectedHex());
  hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
}