function createHexVisual(hex, c){
    var center = c;
    function nextCoord(idx){
        return [center.x + hex.points[idx].x, center.y + hex.points[idx].y]
    }
  
    var hexShape = new Konva.Shape({
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

    hexShape.resetFill = function(){
        hexShape.setFill('#2d862d');
    }
    hexShape.setHoverFill = function(){
        hexShape.setFill('#3399ff');
    }
    hexShape.setSelectedFill = function(){
        hexShape.setFill('#53c653');
    }
    hexShape.setHighlightedMoveFill = function(){
        hexShape.setFill('#39ac39');
    }
    hexShape.setHighlightedAttackFill = function(){
        hexShape.setFill('#775353');
    }
    hexShape.resetBorder = function(){
        hexShape.setStrokeWidth(1);
    }
    hexShape.setSelectedBorder = function(){
        hexShape.setStrokeWidth(3);
    }

    hex.sceneNode = hexShape;

    return hexShape;
}

function createHexCoordVisual(hex, center){
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
    return simpleText;
}