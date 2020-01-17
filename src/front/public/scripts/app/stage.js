function setupStage(grid, eventBus, images) {
  var container = document.getElementById('container');
  var width = container.clientWidth;
  var height = container.offsetTop;
  var center = { x: width / 2, y: height / 2 };
  var stageWidth = 0;
  var stageHeight = 0;
  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
    dragBoundFunc: (pos) => {
      var ratiox = this.visualViewport.width / stageWidth;
      var ratioy = this.visualViewport.height / stageHeight;
      var margin = 50;
      var c = { 
        x: pos.x, y: pos.y,
        sx: center.x / ratiox, sy: center.y / ratioy
      }
      if (Math.abs(c.x) + margin > c.sx){
        c.x = stage.getAbsolutePosition().x;
      }
      if (Math.abs(c.y) + margin > c.sy){
        c.y = stage.getAbsolutePosition().y;
      }
      console.log(c);
      return { x: c.x, y: c.y };
    }
  });

  grid.initDrawing(center);

  var animator = new Animator();

  var terrainLayer = createTerrainLayer();
  var { minX, minY, maxX, maxY } = terrainLayer.addGridNodes(grid, addNode);
  stageWidth = Math.abs(minX) + Math.abs(maxX) + 60;
  stageHeight = Math.abs(minY) + Math.abs(maxY) + 160;
  container.style.minHeight = stageHeight + 'px';
  stage.setHeight(stageHeight);
  height = stageHeight;
  center.y = height / 2;
  terrainLayer.setY(center.y);
  
  var effectLayer = createEffectLayer(center);
  var unitLayer = createUnitLayer(center, grid, animator);
  var hlLayer = createHighlightLayer(center);
  var tooltipLayer = createTooltipLayer(stage);
  var waitLayer = createWaitLayer(width, height);

  waitLayer.show(['Sir, You\'re first on the battlefield.', 'Hopefully the other army will arrive soon.']);

  eventBus.on('battlestarted', () => {
    waitLayer.hide();
  });

  eventBus.on('battleended', result => {
    hlLayer.highlightNode(null);
    effectLayer.drawPath([]);
    hlLayer.highlightRange([], grid.getSelectedHexState());
    grid.hexSelected();
    unitLayer.refresh();
    tooltipLayer.hideTooltip();
    waitLayer.show(['Battle has ended', ...result]);
  });

  eventBus.on('battlestate', txt => {
    console.log(txt);
  });

  eventBus.on('battleupdated', u => {
    var animationPath = grid.getPathBetween(grid.getHexAt(u.delta.source.x, u.delta.source.y), grid.getHexAt(u.delta.target.x, u.delta.target.y));
    animator.getAnimation(u.data.currUnit.id, animationPath).then(() => {
      var nextHex = grid.updateSelection(u.data.currUnit);
      if (grid.isPlayerArmy(u.data.nextUnit.id)) {
        hlLayer.highlightNode([nextHex]);
        hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      }
      unitLayer.refresh();
      var margin = 100;
      if ((stage.getX() + center.x + nextHex.center.x < margin || stage.getX() + center.x + nextHex.center.x > container.clientWidth - margin )
      || (stage.getY() + center.y + nextHex.center.y < margin || stage.getY() + center.y + nextHex.center.y > container.clientHeight - margin )){
        setTimeout(() => {
          stage.setX(-nextHex.center.x);
          stage.setY(-nextHex.center.y);
          cullView(container, stage, terrainLayer);
          stage.batchDraw();
        }, 500);
      }
    });
  });

  var touchStartX;
  var touchStartY;
  stage.on('touchstart', evt => {
    touchStartX = -stage.getX() + evt.evt.touches[0].clientX;
    touchStartY = -stage.getY() + evt.evt.touches[0].clientY;
  });

  stage.on('touchmove', evt => {
    var x = -(touchStartX - evt.evt.touches[0].clientX);
    var y = -(touchStartY - evt.evt.touches[0].clientY);
    stage.setX(x);
    stage.setY(y);
    cullView(container, stage, terrainLayer);
    stage.draw();
  });

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

      if (aUnit != null && grid.isPlayerArmy(aUnit.id)) {
        hlLayer.highlightNode([hex, selHex]);
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
    hlLayer.highlightNode([selHex]);
    hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
  }

  window.addEventListener('resize', () => stage.draw());

  Konva.pixelRatio = 1;
}