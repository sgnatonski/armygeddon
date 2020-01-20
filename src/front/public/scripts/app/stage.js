function cullViews(viewport, stage, layers) {
  layers.forEach(l => {
    cullView(viewport, stage, l);
  })
}

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
      if (Math.abs(c.x) + margin > c.sx) {
        c.x = stage.getAbsolutePosition().x;
      }
      if (Math.abs(c.y) + margin > c.sy) {
        c.y = stage.getAbsolutePosition().y;
      }
      cullViews(this.visualViewport, stage, [terrainLayer, unitLayer.node, effectLayer]);

      return { x: c.x, y: c.y };
    }
  });

  stage.on('dragstart', function () {
    stage.listening(false);
  });
  stage.on('dragend', function () {
    stage.listening(true);
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
  var tooltipLayer = createTooltipLayer(stage);
  var waitLayer = createWaitLayer(stage, width, height);

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click dbltap', () => {
      effectLayer.highlightNode(null);
      effectLayer.drawPath([]);
      effectLayer.highlightRange([], grid.getSelectedHexState());
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
        effectLayer.highlightNode([hex, selHex]);
        effectLayer.drawPath(grid.getPathBetween(grid.getSelectedHex(), hex));
        effectLayer.highlightRange(grid.getSelectedHexRange(), state);
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
      effectLayer.highlightNode(null);
      tooltipLayer.hideTooltip();
    });

    //node.add(createHexCoordVisual(hex, center));

    return node;
  }

  stage.add(terrainLayer);
  stage.add(effectLayer);
  stage.add(unitLayer.node);
  stage.add(tooltipLayer.node);
  stage.add(waitLayer.node);

  grid.hexSelected();
  var selHex = grid.getSelectedHex();
  if (selHex) {
    var unit = grid.getUnitAt(selHex.x, selHex.y);
    if (grid.isPlayerArmy(unit.id)) {
      effectLayer.highlightNode([selHex]);
      effectLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
    }

    centerHex(selHex.center);
  }

  eventBus.on('battlewaiting', () => {
    waitLayer.show(['Sir, You\'re first on the battlefield.', 'Hopefully the other army will arrive soon.']);
  });

  eventBus.on('battlestarted', () => {
    waitLayer.hide();
  });

  eventBus.on('battleended', result => {
    effectLayer.highlightNode(null);
    effectLayer.drawPath([]);
    effectLayer.highlightRange([], grid.getSelectedHexState());
    grid.hexSelected();
    unitLayer.refresh();
    tooltipLayer.hideTooltip();
    waitLayer.show(['Battle has ended', ...result]);
  });

  eventBus.on('battlestate', txt => {
    console.log(txt);
  });

  function centerHex(unitPos) {
    var margin = 100;
    if ((stage.getX() + center.x + unitPos.x < margin || stage.getX() + center.x + unitPos.x > container.clientWidth - margin)
      || (stage.getY() + center.y + unitPos.y < margin || stage.getY() + center.y + unitPos.y > container.clientHeight - margin)) {
      setTimeout(() => {
        stage.setX(-unitPos.x);
        stage.setY(-unitPos.y);
        cullViews(this.visualViewport, stage, [terrainLayer, unitLayer.node, effectLayer]);
        stage.batchDraw();
      }, 0);
    }
  }

  eventBus.on('battleupdated', u => {
    var animationPath = grid.getPathBetween(grid.getHexAt(u.delta.source.x, u.delta.source.y), grid.getHexAt(u.delta.target.x, u.delta.target.y));
    animator.getAnimation(u.data.currUnit.id, animationPath).then(() => {
      var nextHex = grid.updateSelection(u.data.currUnit);
      if (grid.isPlayerArmy(u.data.nextUnit.id)) {
        effectLayer.highlightNode([nextHex]);
        effectLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      }
      centerHex(nextHex.center);
      unitLayer.refresh();
    });
  });

  window.addEventListener('resize', () => stage.draw());

  Konva.pixelRatio = 1;
}