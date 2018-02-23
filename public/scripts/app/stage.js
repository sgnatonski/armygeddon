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
  var waitLayer = new Konva.Layer();
  var waitOverlay = new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: 'black',
    opacity: 0.5
  });
  waitLayer.add(waitOverlay);
  
  eventBus.on('battlestarted', () => {
    waitOverlay.hide();
    waitLayer.draw();
  });

  var animationPath = null;

  eventBus.on('unitdelta', delta => {
    animationPath = grid.getPathBetween(grid.getHexAt(delta.source.x, delta.source.y), grid.getHexAt(delta.target.x, delta.target.y));
  });

  eventBus.on('battleupdated', data => {
    animator.getAnimation(data.currUnit.id, animationPath).then(() => {
      var nextHex = grid.updateSelection(data.currUnit);
      hlLayer.highlightNode(nextHex);
      hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
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
  stage.add(waitLayer);

  grid.hexSelected();
  hlLayer.highlightNode(grid.getSelectedHex());
  hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
}