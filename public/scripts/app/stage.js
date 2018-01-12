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

  grid.getUnits().forEach(unit => {
    var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
    var unitSceneNode = createUnitVisual(unit, center, hex.center);
    animator.registerAnimation(unit.id, unitSceneNode, center);
    unitLayer.add(unitSceneNode);
  });

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
      });
    });

    node.on('mouseenter', () => {
      hlLayer.highlightNode(hex);
      effectLayer.drawPath(grid.getPathFromSelectedHex(hex));
      hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState());
    });
    
    node.on('mouseleave', () => {
      hlLayer.highlightNode(null);
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