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

  var terrainLayer = createTerrainLayer();
  var hlLayer = createHighlightLayer(center);
  var tooltipLayer = new Konva.Layer();

  grid.initDrawing(center);

  var tooltip = createTooltipVisual();

  tooltipLayer.add(tooltip.node);

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click', () => {
      hex.cost = hex.cost == 1 ? 2 : 1;
      terrainLayer.addGridNodes(grid, addNode);
      terrainLayer.draw();
    });

    node.on('mouseenter', () => {
      hlLayer.highlightNode(hex);      
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
  stage.add(tooltipLayer);

  grid.hexSelected();
}