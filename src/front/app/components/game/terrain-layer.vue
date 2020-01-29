<template>
  <konva-layer ref="layer">
    <konva-shape
      v-for="hex in hexes"
      :key="hex.x + ':' + hex.y"
      :config="{
        sceneFunc: function(context, shape) {
            context.beginPath();
            context.moveTo(0, 30);
            context.lineTo(-26, 15);
            context.lineTo(-26, -15);
            context.lineTo(0, -30);
            context.lineTo(26, -15);
            context.lineTo(26, 15);
            context.closePath();
            context.fillStrokeShape(shape);
        },
        stroke: '#003300',
        strokeWidth: 0.7,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
      }"
    ></konva-shape>
  </konva-layer>
</template>

<script>
function createShape(img) {
  return new Konva.Image({
    image: img,
    width: 70,
    height: 70,
    offset: {
      x: 35,
      y: 35
    },
    rotation: 30,
    perfectDrawEnabled: false
  }).cache();
}

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
  stroke: "#003300",
  strokeWidth: 0.7,
  strokeHitEnabled: false,
  perfectDrawEnabled: false
}).cache();

function loadImages(){
    return load([
        '/images/grid/plain1.png',
        '/images/grid/plain2.png',
        '/images/grid/plain3.png',
        '/images/grid/plain4.png',
        '/images/grid/plain5.png',
        '/images/grid/plain6.png',
        '/images/grid/forrest1.png',
        '/images/grid/forrest2.png'
    ]).then(imgs =>{
        return {
            plains: imgs.slice(0, 6),
            forrests: [imgs[6], imgs[7]]
        };
    });
}

export default {
  props: {
    hexes: null
  },
  mounted() {
    loadImages().then(images => {
    var imageShapes = {
        plains: images.plains.map(createShape),
        forrests: images.forrests.map(createShape)
    };
    this.$refs.layer.getNode().destroyChildren();
    this.hexes
      .map(hex => {
        function getHexTerrainImage(hex) {
          if (hex.cost < 0) {
            return;
          }
          var shape;
          if (hex.cost == 1) {
            var gNumber = Math.floor(Math.random() * 6);
            shape = imageShapes.plains[gNumber].clone();
          } else {
            var gNumber = Math.floor(Math.random() * 2);
            shape = imageShapes.forrests[gNumber].clone();
          }

          return shape;
        }

        var group = new Konva.Group({
          x: center.x + hex.center.x,
          y: center.y + hex.center.y
        });

        var terrain = getHexTerrainImage(hex);

        if (terrain) {
          group.add(terrain);
        }
        group.add(hexShape.clone());

        return group;
      })
      .forEach(node => {
        this.$refs.layer.getNode().add(node);
      });
    });
  }
};
</script>