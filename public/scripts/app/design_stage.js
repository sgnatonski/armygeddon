function setupStage(grid, animator, images){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  var terrainLayer = new Konva.Layer();
  var hlLayer = createHighlightLayer(center);
  var tooltipLayer = new Konva.Layer();

  grid.initDrawing(center);

  var tooltip = createTooltipVisual();

  tooltipLayer.add(tooltip.node);

  function addNode(hex) {
    var node = createTerrainVisual(hex, center, images);

    node.on('click', () => {
      hex.cost = hex.cost == 1 ? 2 : 1;
      addNodes();
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

  function addNodes(){
    terrainLayer.destroyChildren();
    grid.getHexes().sort((a, b) => {
      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;

      if (a.x > b.x) return 1;
      if (a.x < b.x) return -1;

      return 0;
    })
    .map(hex => addNode(hex))
    .forEach(node => {
      terrainLayer.add(node.node);
      terrainLayer.add(node.coord);
    });
  }

  addNodes();

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(tooltipLayer);

  grid.hexSelected();
}