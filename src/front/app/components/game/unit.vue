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
        sceneFunc: (context, shape) => {
            if (!unit.armor){
                return;
            }
            var x = 0;
            if (unit.directions.length > 1){
                x = 1;
            }
            var rotation = -30 + (unit.directions[0] - 1) * 60 - (x * 60);
            var angle = 60 * unit.directions.length;
            context.rotate(Konva.getAngle(rotation));
            context.beginPath();
            context.arc(0, 0, 32, 0, Konva.getAngle(angle), false);
            context.lineTo(0, 0);
            context.closePath();
            context.fillStrokeShape(shape);
        }
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
        sceneFunc: (context, shape) => {
            var fillValue = unit.endurance / unit.lifetime.endurance;
            if (fillValue < 0){
                fillValue = 0;
            }
            var off = Math.floor(30 * fillValue);
            context.beginPath();
            context.rect(0, 30 - off, 2, off);
            context.closePath();
            context.fillStrokeShape(shape);
            },
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
    unit: Object
  },
  methods: {
    getShape: getShape,
  }
};
</script>