<template>
  <div id="container">
    <konva-stage
      ref="stage"
      :config="stageConfig"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <TerrainLayer ref="terrainLayer" v-if="hexes.length" :hexes="hexes"></TerrainLayer>
    </konva-stage>
  </div>
</template>

<script>
import TerrainLayer from "./terrain-layer.vue";
import eventBus from "../../eventbus.js";
import grid from "../../../game/grid.js";

export default {
  components: {
    TerrainLayer
  },
  props: {
    battle: null
  },
  computed: {
    hexes: args => {
      if (!args.grid) {
        return [];
      }

      return args.grid.getHexes();
    },
    grid: args => {
      if (!args.battle) {
        return null;
      }
      var g = grid(args.battle);

      var { minX, minY, maxX, maxY } = g.initDrawing(args.center);
      args.stageConfig.width = Math.abs(minX) + Math.abs(maxX) + 60;
      args.stageConfig.height = Math.abs(minY) + Math.abs(maxY) + 160;
      container.style.minHeight = args.stageConfig.height + "px";
      args.$refs.stage.getStage().setHeight(args.stageConfig.height);
      args.height = args.stageConfig.height;
      args.center.y = args.height / 2;
      // terrainLayer.setY(center.y);

      eventBus.publish("battlestarted");

      return g;
    }
  },
  mounted() {
    var container = document.getElementById("container");
    this.width = container.clientWidth;
    this.height = container.offsetTop;
    this.center = { x: this.width / 2, y: this.height / 2 };
  },
  methods: {
    handleDragStart() {
      this.listening(false);
    },
    handleDragEnd() {
      this.listening(true);
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      center: 0,
      stageConfig: {
        width: this.width,
        height: this.height,
        draggable: true,
        dragBoundFunc: pos => {
          var ratiox = window.visualViewport.width / stageWidth;
          var ratioy = window.visualViewport.height / stageHeight;
          var margin = 50;
          var c = {
            x: pos.x,
            y: pos.y,
            sx: center.x / ratiox,
            sy: center.y / ratioy
          };
          if (Math.abs(c.x) + margin > c.sx) {
            c.x = this.$refs.stage.getAbsolutePosition().x;
          }
          if (Math.abs(c.y) + margin > c.sy) {
            c.y = this.$refs.stage.getAbsolutePosition().y;
          }
          /*cullViews(window.visualViewport, this.$refs.stage, [
            terrainLayer,
            unitLayer.node,
            effectLayer
          ]);*/

          return { x: c.x, y: c.y };
        }
      }
    };
  }
};
</script>