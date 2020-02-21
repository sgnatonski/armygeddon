<template>
  <v-group
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
    <v-path
      ref="direction"
      v-if="endurance"
      :config="{
        x: 19,
        y: 15,
        fill: '#ffff66',
        opacity: 0.35,
        perfectDrawEnabled : false,
        strokeHitEnabled: false,
        sceneFunc: directionSceneFunc
    }"
    ></v-path>
    <v-path
      ref="unitBack"
      :config="{
        data: getShape('unitBack'),
        fill: unitColor,
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
    ></v-path>
    <v-path
      ref="unitPath"
      v-if="endurance"
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
    ></v-path>
    <UnitType v-if="endurance" :type="unit.type" />
    <v-group ref="health">
      <v-rect
        v-if="endurance"
        :config="{
            width: 2,
            height: 30,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            strokeHitEnabled: false,
            perfectDrawEnabled : false
        }"
      ></v-rect>
      <v-shape
        v-if="endurance"
        :config="{
        sceneFunc: healthSceneFunc,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 0.5,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
        }"
      ></v-shape>
    </v-group>
  </v-group>
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
    directions: args => args.unit.directions,
    endurance: args => Math.max(0, args.unit.endurance / args.unit.lifetime.endurance),
    unitColor: args => args.endurance ? args.color : '#888888'
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
      context.arc(0, 0, 30, 0, window.Konva.getAngle(angle), false);
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