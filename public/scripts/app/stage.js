function setupStage(grid, animator){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  var effectLayer = createEffectLayer(center);
  var unitLayer = new Konva.Layer();
  var hlLayer = createHighlightLayer(center);

  grid.initDrawing(center);

  var armyColors = [
    '#00cc00',
    '#c80b04'
  ];
  var colId = 0;
  var armyColorSelection = {  };

  grid.getUnits().forEach(unit => {
    var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
    var armyId = grid.getArmyId(unit.id);
    if (!armyColorSelection[armyId]){
      armyColorSelection[armyId] = armyColors[colId];
      colId++;
    }
    var unitSceneNode = createUnitVisual(unit, center, hex.center, armyColorSelection[armyId]);
    animator.registerAnimation(unit.id, unitSceneNode, center);
    unitLayer.add(unitSceneNode);
  });

  var tooltip = createTooltipVisual();

  unitLayer.add(tooltip.node);

  function addNode(hex, layer) {
    var node = createHexVisual(hex, center);

    node.on('click', () => {
      hlLayer.highlightNode(null);
      effectLayer.drawPath([]);
      hlLayer.highlightRange([], grid.getSelectedHexState());
      grid.hexSelected(hex).then(h => {
          hlLayer.highlightNode(h);
          effectLayer.drawPath(grid.getPathFromSelectedHex(h));
          hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
          unitLayer.draw();
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
            chrText = aUnit.charge + ' charge';
          }
          var dmgText = '-' + dmg + ' damage';
          tooltip.show(endText + '\n' + chrText + '\n' + dmgText, mousePos);
          unitLayer.batchDraw();
        }
      }
    });
    
    node.on('mouseleave', () => {
      hlLayer.highlightNode(null);
      tooltip.hide();
      unitLayer.draw();
    });

    layer.add(node);
  }

  function chunkArray(array, chunk_size){
    var arr = array.slice();
    var results = [];
    
    while (arr.length) {
        results.push(arr.splice(0, chunk_size));
    }
    
    return results;
  }
  
  var chunks = chunkArray(grid.getHexes(), 100);
  for(var n = 0; n < chunks.length; n++){
    var layer = new Konva.Layer();
    for(var i = 0; i < chunks[n].length; i++){
      var hex = chunks[n][i];
      addNode(hex, layer);
    }
    stage.add(layer);
    layer = new Konva.Layer();
  }
  stage.add(hlLayer);
  stage.add(effectLayer);
  stage.add(unitLayer);
}