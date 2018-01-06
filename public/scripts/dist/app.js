var Game = Game || {};

Game.Battle = function (firstPlayer, secondPlayer) {
	this.firstPlayer = firstPlayer;
	this.secondPlayer = secondPlayer;
};

Game.Battle.prototype.initialize = function () {
	
};

Game.Battle.prototype.nextPlayerAction = function () {
	
};
var Game = Game || {};

Game.Player = function (id, name) {
	this.id = id;
	this.name = name;
};

Game.Player.prototype.getArmy = function () {
	
};

Game.Player.prototype.setArmy = function () {
	
};
var Game = Game || {};

Game.Army = function (units) {
	this.units = units;
};

function start (gridsize){
    var width = window.innerWidth;
    var height = window.innerHeight;
    var center = { x: width / 2, y: height / 2 };

    var grid = initGrid(center);

    var unitPath = new Konva.Path({
      data: 'M316 308c-11 0-22-7-26-17l-2-5 45-7a6 6 0 0 0 5-7c-6-37-7-76-3-113l1-12a107 107 0 0 0-74-114c-13-4-23-15-26-29 0-2-2-4-5-4a6 6 0 0 0-5 5c-3 13-13 24-26 28a106 106 0 0 0-74 114l1 12a415 415 0 0 1-2 117l4 3 48 7-2 5c-5 10-15 17-27 17h-2c-32 0-58 26-58 58v91c0 3 2 5 5 5h276c3 0 5-2 5-5v-91c0-32-26-58-58-58zm47 58v59a61 61 0 0 1-70-60c0-18 8-35 22-46h1c26 0 47 21 47 47zm-132-63c-14 0-27-5-37-14l17 3a5 5 0 0 0 7-7l-2-10a66 66 0 0 0 30 0l-1 10a6 6 0 0 0 6 7l17-3c-10 9-23 14-37 14zm18-40a55 55 0 0 1-35 0l-14-75c-1-3-3-4-6-4h-16a19 19 0 0 1-20-21c0-10 9-19 20-19h106a19 19 0 0 1 20 20c0 11-9 20-20 20h-16c-3 0-5 1-6 4l-13 75zM138 157l-1-11a96 96 0 0 1 66-103c9-2 17-8 23-14v86a6 6 0 0 0 11 0V29c5 6 13 12 22 14a95 95 0 0 1 66 103l-1 11c-4 37-3 75 2 112l-69 11 15-85h12c17 0 31-14 31-30a30 30 0 0 0-31-32H178c-16 0-30 14-31 30a30 30 0 0 0 31 32h12l15 85-69-11c6-37 6-75 2-112zm8 162h1c14 11 22 28 22 46a61 61 0 0 1-70 60v-59c0-26 21-47 47-47zM99 436a72 72 0 0 0 81-71c0-18-7-35-19-48 10-4 19-11 24-22 11 11 25 18 40 19v137H99v-15zm137 15V314c17-1 32-9 43-21l1 2c4 10 12 17 22 21a72 72 0 0 0 62 120v15H235z',
      fill: '#000000',
      listening: false,
      scale: {
        x: 0.10,
        y: 0.10
      }
    });
    
    var unitHex1 = grid.getHexAt(new BHex.Axial(0, 0));
    unitHex1.unit = {
      mobility: 2,
      sceneNode: unitPath.clone()
    };

    var unitHex2 = grid.getHexAt(new BHex.Axial(10, -4));
    unitHex2.unit = {
      mobility: 4,
      sceneNode: unitPath.clone()
    };

    var unitHex3 = grid.getHexAt(new BHex.Axial(-6, -5));
    unitHex3.unit = {
      mobility: 1,
      sceneNode: unitPath.clone()
    };

    setupStage(grid, width, height, center);    
};

function initGrid(center){
  var sideWidth = 30;
  var options = new BHex.Drawing.Options(sideWidth, BHex.Drawing.Static.Orientation.PointyTop, new BHex.Drawing.Point(center.x, center.y));
  var grid = new BHex.Grid(20);
  BHex.Drawing.Drawing(grid, options);

  grid.setSelectedHex = function(x, y, callback){
    var selectedHex = grid.selectedHex;
    if (selectedHex){
      selectedHex.sceneNode.resetState();
    }

    grid.selectedHex = null;

    var hex = grid.getHexAt(new BHex.Axial(x, y));
    if (hex.sceneNode && hex !== selectedHex){
      grid.selectedHex = hex;
    }

    callback();    
  }

  return grid;
}

function setupStage(grid, width, height, center){
  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

  function addNode(hex, layer) {    
    function nextCoord(idx){
      return [center.x + hex.points[idx].x, center.y + hex.points[idx].y]
    }

    var node = new Konva.Shape({
      sceneFunc: function(context) {
        context.beginPath();
        context.moveTo(...nextCoord(0));
        context.lineTo(...nextCoord(1));
        context.lineTo(...nextCoord(2));
        context.lineTo(...nextCoord(3));
        context.lineTo(...nextCoord(4));
        context.lineTo(...nextCoord(5));
        context.closePath();

        // Konva specific method
        context.fillStrokeShape(this);
      },
      fill: '#2d862d',
      stroke: '#003300',
      strokeWidth: 1
    });

    node.resetState = function(){
      node.setFill('#2d862d');
      layer.draw();
    }
    node.setHoverState = function(){
      dirtyLayers = [];
      function resetHighlight(currentHex){    
        currentHex.sceneNode.highlighted = false;
        currentHex.sceneNode.setFill('#2d862d');
        var neighbors = grid.getNeighbors(currentHex);
        for (var i = 0; i < neighbors.length; i++){
          if (neighbors[i].sceneNode && neighbors[i].sceneNode.highlighted){
            resetHighlight(neighbors[i]);
            dirtyLayers.push(currentHex.sceneNode.getLayer());
          }
        }
      }
      resetHighlight(hex);
      node.setFill('#3399ff');
      dirtyLayers.push(layer);
      var unique = [...new Set(dirtyLayers)];
      if (unique.length > 1)
      {
        var o = 0;
      }
      for (var i = 0; i < unique.length; i++){
        unique[i].draw();
      }
    }
    node.setSelectedState = function(){
      node.setFill('#53c653');
      layer.draw();
    }
    node.setHighlightedState = function(){
      node.setFill('#53c631');
      node.highlighted = true;
      layer.draw();
    }
    node.isSelected = function(){
      return grid.selectedHex && grid.selectedHex.sceneNode === node;
    }

    node.on('click', function() {
      grid.setSelectedHex(hex.x, hex.y, function() {
        node.isSelected()
          ? node.setSelectedState()
          : node.setHoverState();
      });
    });

    node.on('mouseover', function() {
      if (!node.isSelected() && !node.highlighted){
        node.setHoverState();        
      }
      if (hex.unit) {
        var range = grid.getRange(new BHex.Axial(hex.x, hex.y), hex.unit.mobility);
        for (var i = 0; i < range.length; i++){
          if (range[i].sceneNode){
            range[i].sceneNode.setHighlightedState();
          }
        }
      }
    });
    node.on('mouseout', function() {
      if (!node.isSelected() && !node.highlighted){
        node.resetState();
      }
      if (node.highlighted){
        node.setHighlightedState();
      }
    });

    var simpleText = new Konva.Text({
      x: center.x + hex.center.x,
      y: center.y + hex.center.y,
      text: `${hex.x}, ${hex.y}`,
      fontSize: 10,
      fill: 'black',
      listening: false
    });

    simpleText.setOffset({
      x: simpleText.getWidth() / 2,
      y: simpleText.getHeight() / 2
    });

    layer.add(node);
    layer.add(simpleText);

    if (hex.unit){
      hex.unit.sceneNode.setX(center.x + hex.center.x - 23);
      hex.unit.sceneNode.setY(center.y + hex.center.y - 28);
      layer.add(hex.unit.sceneNode);
    }

    hex.sceneNode = node;
  }

  var chunks = chunkArray(grid.hexes, 20);
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
}

function chunkArray(array, chunk_size){
  var arr = array.slice();
  var results = [];
  
  while (arr.length) {
      results.push(arr.splice(0, chunk_size));
  }
  
  return results;
}