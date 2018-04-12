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