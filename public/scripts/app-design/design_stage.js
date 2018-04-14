function setupStage(grid, animator, images){
  var width = window.innerWidth;
  var height = window.innerHeight;
  var center = { x: width / 2, y: height / 2 };

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  var mode = 0;

  window.addEventListener("keypress", function(event){
    if (event.keyCode == 49) {// 1
      event.preventDefault(); 
      mode = 0;
      console.log('Terrain size mode ON');
    }
    if (event.keyCode == 50) {// 2
      event.preventDefault(); 
      mode = 1;
      console.log('Terrain type mode ON');
    }
    if (event.keyCode == 51) {// 3
      event.preventDefault(); 
      mode = 2;
      console.log('Unit mode ON');
    }
  });
  window.addEventListener("keydown", function(event){
    if(event.ctrlKey && event.keyCode == 83) {// CTLR+S
      event.preventDefault(); 

      var name = prompt("Please enter battle template name");

      var terrain = grid.getHexes().filter(h => h.cost > 0).map(h => { 
        return { 
          x: h.x, 
          y: h.y, 
          cost: h.cost
        }
      });

      Game.fetch().post('/design/save', { 
        name: name,
        terrain: terrain 
      });
    }
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
      if (mode == 0){
        hex.cost = hex.cost > 0 ? -1 : 1;
      }
      else if (mode == 1){
        hex.cost = hex.cost == 1 ? 2 : 1;
      }
      else{
        
      }
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

    return node;
  }

  terrainLayer.addGridNodes(grid, addNode);

  stage.add(terrainLayer);
  stage.add(hlLayer);
  stage.add(tooltipLayer);

  grid.hexSelected();
}