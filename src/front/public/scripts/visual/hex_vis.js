var imageShapes;

var hexShape = new Konva.Shape({
    sceneFunc: function(context) {
      context.beginPath();
      context.moveTo(0, 30);
      context.lineTo(-26, 15);
      context.lineTo(-26, -15);
      context.lineTo(0, -30);
      context.lineTo(26, -15);
      context.lineTo(26, 15);
      context.closePath();
      context.fillStrokeShape(this);
    },
    stroke: '#003300',
    strokeWidth: 0.7,
    strokeHitEnabled: false,
    perfectDrawEnabled : false
}).cache();

function createTerrainVisual(hex, center, images){
    if (!imageShapes){
        function createShape(img){
            return new Konva.Image({
                image: img,
                width: 70,
                height:70,
                offset: {
                    x: 35,
                    y: 35
                },
                rotation: 30,
                perfectDrawEnabled : false
              }).cache();
        };

        imageShapes = {
            plains: images.plains.map(createShape),
            forrests: images.forrests.map(createShape)
        };
    }
    
    function getHexTerrainImage(hex){
        if (hex.cost < 0){
            return;
        }
        var shape;
        if (hex.cost == 1){
            var gNumber = Math.floor(Math.random() * 6);
            shape = imageShapes.plains[gNumber].clone();
        }
        else {
            var gNumber = Math.floor(Math.random() * 2);
            shape = imageShapes.forrests[gNumber].clone();
        }

        return shape;
    }

    var group = new Konva.Group({
        x: center.x + hex.center.x,
        y: center.y + hex.center.y,
    });
    
    var terrain = getHexTerrainImage(hex);

    if(terrain){
        group.add(terrain);
    }
    group.add(createHexVisual());
    
    return group;
}

function createHexVisual(){
    return hexShape.clone();
}

function createHexCoordVisual(hex){
    var simpleText = new Konva.Text({
        text: `${hex.x}, ${hex.y}`,
        fontSize: 10,
        fill: 'black',
        listening: false,
        perfectDrawEnabled : false
    });
  
    simpleText.setOffset({
        x: simpleText.getWidth() / 2,
        y: simpleText.getHeight() / 2
    });
    return simpleText;
}