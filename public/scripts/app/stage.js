function setupStage(grid, eventBus, images){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  window.addEventListener('resize', event => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
  });

  grid.initDrawing(center);

  var animator = new Animator();

  var effectLayer = createEffectLayer(center);
  var unitLayer = createUnitLayer(center, grid, animator);
  var hlLayer = createHighlightLayer(center);
  var terrainLayer = createTerrainLayer();
  var tooltipLayer = createTooltipLayer(stage);
  var waitLayer = createWaitLayer(width, height);
  
  eventBus.on('battlestarted', () => {
    waitLayer.hide();
  });

  var animationPath = null;

  eventBus.on('unitdelta', delta => {
    animationPath = grid.getPathBetween(grid.getHexAt(delta.source.x, delta.source.y), grid.getHexAt(delta.target.x, delta.target.y));
  });

  eventBus.on('battleupdated', data => {
    animator.getAnimation(data.currUnit.id, animationPath).then(() => {
      var nextHex = grid.updateSelection(data.currUnit);
      if (grid.isPlayerArmy(data.nextUnit.id)){
        hlLayer.highlightNode(nextHex);
        hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      }
      unitLayer.refresh();
    });
  });

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click', () => {
      hlLayer.highlightNode(null);
      effectLayer.drawPath([]);
      hlLayer.highlightRange([], grid.getSelectedHexState());      
      grid.hexSelected(hex);
    });

    node.on('mouseenter', () => {
      if (animator.isAnimating()){
        return;
      }
      var aUnit = null;
      var selHex = grid.getSelectedHex();
      if (selHex){
        aUnit = grid.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = grid.getUnitAt(hex.x, hex.y);
      var state = grid.getSelectedHexState();
      
      if (grid.isPlayerArmy(aUnit.id)){
        hlLayer.highlightNode(hex);
        effectLayer.drawPath(grid.getPathBetween(grid.getSelectedHex(), hex));
        hlLayer.highlightRange(grid.getSelectedHexRange(), state);
      }

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
  stage.add(waitLayer.node);

  grid.hexSelected();
  var selHex = grid.getSelectedHex();
  if (!selHex){
    return;
  }
  var unit = grid.getUnitAt(selHex.x, selHex.y);
  if (grid.isPlayerArmy(unit.id)){
    hlLayer.highlightNode(selHex);
    hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
  }
}