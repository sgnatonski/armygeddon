<template>
  <konva-shape
    :config="{
        sceneFunc: hexDrawSceneFunc,
        stroke: '#113311',
        strokeWidth: 0.7,
        strokeHitEnabled: false,
        perfectDrawEnabled : false,
        fill: fill,
        opacity: opacity,
        listening: false,
        x: x,
        y: y
      }"
  ></konva-shape>
</template>

<script>
export default {
  props: {
    x: Number,
    y: Number,
    fill: String,
    opacity: Number
  },
  methods: {
    hexDrawSceneFunc(context, shape) {
      context.beginPath();
      context.moveTo(0, 30);
      context.lineTo(-26, 15);
      context.lineTo(-26, -15);
      context.lineTo(0, -30);
      context.lineTo(26, -15);
      context.lineTo(26, 15);
      context.closePath();
      context.fillStrokeShape(shape);
    }
  }
};
</script>