function setupStage(grid){
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };
  
    var stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    });
  
    var effectLayer = createEffectLayer();
    var unitLayer = new Konva.Layer();
    var hlLayer = createHighlightLayer();
  
    function addNode(hex, layer) {    
      //var text = createHexCoordVisual(hex, center);
      var node = createHexVisual(hex, center);

      node.on('click', () => {
        hlLayer.highlightNode(null, center);
        effectLayer.drawPath(grid, null, null, center);
        hlLayer.highlightRange([], grid.getSelectedHexState(), center);
        grid.hexSelected(hex).then(() => {
            hlLayer.highlightNode(hex, center);
            effectLayer.drawPath(grid, grid.selectedHex, hex, center);
            hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState(), center);
        });
      });
  
      node.on('mouseenter', () => {
        hlLayer.highlightNode(hex, center);
        effectLayer.drawPath(grid, grid.selectedHex, hex, center);
        hlLayer.highlightRange(grid.getSelectedHexRange(), grid.getSelectedHexState(), center);
      });
      
      node.on('mouseleave', () => {
        hlLayer.highlightNode(null, center);
      });
  
      layer.add(node);
      //layer.add(text);
  
      if (hex.unit){
        hex.unit.animatePath = (node, path) => getUnitMoveAnim(unitLayer, path, node, center);
        hex.unit.sceneNode.setX(center.x + hex.center.x - 23);
        hex.unit.sceneNode.setY(center.y + hex.center.y - 28);
        unitLayer.add(hex.unit.sceneNode);
      }
    }
  
    grid.initDrawing(center);
    
    var chunks = chunkArray(grid.hexes, 100);
    for(var n = 0; n < chunks.length; n++){
      var layer = new Konva.Layer();
      for(var i = 0; i < chunks[n].length; i++){
        var hex = chunks[n][i];
        if (hex.center.x + center.x > 0 && hex.center.x + center.x < width
          && hex.center.y + center.y > 0 && hex.center.y + center.y < height){  
          addNode(hex, layer);
        }
      }
      stage.add(layer);
      layer = new Konva.Layer();
    }
    stage.add(hlLayer);
    stage.add(unitLayer);
    stage.add(effectLayer);
  }
  
  function chunkArray(array, chunk_size){
    var arr = array.slice();
    var results = [];
    
    while (arr.length) {
        results.push(arr.splice(0, chunk_size));
    }
    
    return results;
  }