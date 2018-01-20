function setupStage(grid, animator, images){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  var effectLayer = createEffectLayer(center);
  var unitLayer = createUnitLayer(center, animator);
  var hlLayer = createHighlightLayer(center);
  var tooltipLayer = new Konva.Layer();

  grid.initDrawing(center);

  grid.getUnits().forEach(unit => {
    var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
    var armyId = grid.getArmyId(unit.id);
    unitLayer.addUnit(unit, hex.center, armyId);
  });

  var tooltip = createTooltipVisual();

  tooltipLayer.add(tooltip.node);

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click', () => {
      hlLayer.highlightNode(null);
      effectLayer.drawPath([]);
      hlLayer.highlightRange([], grid.getSelectedHexState());
      grid.hexSelected(hex).then(h => {
          hlLayer.highlightNode(h);
          effectLayer.drawPath(grid.getPathFromSelectedHex(h));
          hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
          unitLayer.refresh(grid.getUnits());
      });
    });

    node.on('mouseenter', () => {
      hlLayer.highlightNode(hex);
      effectLayer.drawPath(grid.getPathFromSelectedHex(hex));
      hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
      var state = grid.getSelectedHexState();
      if (state == 'turning' || state == 'attacking'){
        var aUnit = null;
        var selHex = grid.getSelectedHex();
        if (selHex){
          aUnit = grid.getUnitAt(selHex.x, selHex.y);
        }
        var tUnit = grid.getUnitAt(hex.x, hex.y);

        if (aUnit && tUnit){
          var dmg = Damage().getChargeDamage(aUnit, tUnit);
          var mousePos = stage.getPointerPosition();
          var endText = 'Endurance: ' + tUnit.endurance;
          var chrText = '';
          if (aUnit.charge){
            chrText = Math.pow(aUnit.charge - 1, 2); + ' charge';
          }
          var dmgText = '-' + dmg + ' damage';
          tooltip.show(endText + '\n' + chrText + '\n' + dmgText, mousePos);
          tooltipLayer.batchDraw();
        }
      }
    });
    
    node.on('mouseleave', () => {
      hlLayer.highlightNode(null);
      tooltip.hide();
      tooltipLayer.draw();
    });

    return {
      node: node,
      coord: createHexCoordVisual(hex, center)
    }
  }

  var terrainLayer = new Konva.Layer();
  var nodes = grid.getHexes().sort((a, b) => {
    if (a.y > b.y) return 1;
    if (a.y < b.y) return -1;

    if (a.x > b.x) return 1;
    if (a.x < b.x) return -1;

    return 0;
  }).map(hex => addNode(hex));
  nodes.forEach(node => {
    terrainLayer.add(node.node);
    terrainLayer.add(node.coord);
  });

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(effectLayer);
  stage.add(unitLayer.node);
  stage.add(tooltipLayer);
}