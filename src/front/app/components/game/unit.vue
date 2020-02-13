<template>
  <konva-group
    :config="{
        listening: false,
        x: center.x + hexCenter.x,
        y: center.y + hexCenter.y,
        offset: {
            x: 19,
            y: 15
        }
    }"
  >
    <konva-path
      ref="direction"
      :config="{
        x: 19,
        y: 15,
        fill: '#ffff66',
        opacity: 0.35,
        perfectDrawEnabled : false,
        strokeHitEnabled: false,
        sceneFunc: directionSceneFunc
    }"
    ></konva-path>
    <konva-path
      ref="unitBack"
      :config="{
        data: getShape('unitBack'),
        fill: color,
        scale: {
            x: 0.08,
            y: 0.08
        },
        offsetY: 60,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {x : 40, y : 20},
        shadowOpacity: 0.5,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
        }"
    ></konva-path>
    <konva-path
      ref="unitPath"
      :config="{
        data: getShape('unitPath'),
        fill: '#000000',
        scale: {
            x: 0.08,
            y: 0.08
        },
        offsetY: 60,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    ></konva-path>
    <UnitType :type="unit.type" />
    <konva-group ref="health">
      <konva-rect
        :config="{
            width: 2,
            height: 30,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            strokeHitEnabled: false,
            perfectDrawEnabled : false
        }"
      ></konva-rect>
      <konva-shape
        :config="{
        sceneFunc: healthSceneFunc,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 0.5,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
        }"
      ></konva-shape>
    </konva-group>
  </konva-group>
</template>

<script>
import getShape from "../../shapes.js";
import UnitType from "./unit-type.vue";

export default {
  components: {
    UnitType
  },
  props: {
    center: Object,
    hexCenter: Object,
    unit: Object,
    color: String
  },
  computed: {
    directions() { return this.unit.directions; },
    endurance() { return Math.min(0, this.unit.endurance / this.unit.lifetime.endurance); }
  },
  methods: {
    getShape: getShape,
    directionSceneFunc(context, shape) {
      if (!this.unit.armor) {
        return;
      }
      var x = this.directions.length > 1 ? 1 : 0;
      var rotation = -30 + (this.directions[0] - 1) * 60 - x * 60;
      var angle = 60 * this.directions.length;
      context.rotate(window.Konva.getAngle(rotation));
      context.beginPath();
      context.arc(0, 0, 32, 0, window.Konva.getAngle(angle), false);
      context.lineTo(0, 0);
      context.closePath();
      context.fillStrokeShape(shape);
    },
    healthSceneFunc(context, shape) {
      var off = Math.floor(30 * this.endurance);
      context.beginPath();
      context.rect(0, 30 - off, 2, off);
      context.closePath();
      context.fillStrokeShape(shape);
    }
  }
};
</script>