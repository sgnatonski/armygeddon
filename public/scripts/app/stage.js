function setupStage(grid, animator, images){
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
      var state = grid.getSelectedHexState();
      hlLayer.highlightNode(hex);
      effectLayer.drawPath(grid.getPathFromSelectedHex(hex));
      hlLayer.highlightRange(grid.getSelectedHexRange(), state);
      var aUnit = null;
      var selHex = grid.getSelectedHex();
      if (selHex){
        aUnit = grid.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = grid.getUnitAt(hex.x, hex.y);

      if (state == 'moving' || state == 'turning'){
        if (aUnit && tUnit){
          var mousePos = stage.getPointerPosition();
          var texts = [
            'Endurance: ' + tUnit.endurance + ' / ' + tUnit.lifetime.endurance,
            'Mobility: ' + tUnit.mobility + ' / ' + tUnit.lifetime.mobility,
            'Agility: ' + tUnit.agility + ' / ' + tUnit.lifetime.agility,
            'Damage: ' + tUnit.damage,
            'Armor: ' + tUnit.armor,
            'Range: ' + tUnit.range,
          ];
          tooltip.show(texts, mousePos, texts.length);
          tooltipLayer.batchDraw();
        }
        else if (!tUnit){
          var mousePos = stage.getPointerPosition();
          var cost = grid.getSelectedHexMoveCost(hex.x, hex.y);  
          if (cost <= aUnit.mobility){
            var texts = [
              'Moves: ' + cost + ' / ' + aUnit.mobility,
              'Charge: ' + cost
            ];
            tooltip.show(texts, mousePos, texts.length);
            tooltipLayer.batchDraw();
          }
        }
      }
      else if (state == 'attacking'){        
        if (aUnit && tUnit){
          var dmg = Damage().getChargeDamage(aUnit, tUnit);
          var mousePos = stage.getPointerPosition();
          var texts = [
            'Endurance: ' + tUnit.endurance,
            '-' + dmg + ' damage'
          ];
          tooltip.show(texts, mousePos, texts.length);
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
  
  terrainLayer.addGridNodes(grid, addNode);

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(effectLayer);
  stage.add(unitLayer.node);
  stage.add(tooltipLayer);

  grid.hexSelected();
}