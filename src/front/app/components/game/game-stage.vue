<template>
  <div id="container">
    <konva-stage
      ref="stage"
      :config="stageConfig"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <TerrainLayer
        ref="terrainLayer"
        v-if="hexes.length && imageShapes"
        :hexes="hexes"
        :center="center"
        :imageShapes="imageShapes"
        @selected="hexSelected"
        @focused="hexFocused"
      ></TerrainLayer>
      <EffectLayer
        ref="effectLayer"
        v-if="hexes.length"
        :center="center"
        :highlight="selectedHex"
        :focus="focusHex"
        :path="path"
        :range="unitRange"
        :rangeType="unitState"
      ></EffectLayer>
      <UnitLayer
        ref="unitLayer"
        v-if="hexes.length"
        :hexes="hexes"
        :center="center"
      ></UnitLayer>
    </konva-stage>
  </div>
</template>

<script>
import TerrainLayer from "./terrain-layer.vue";
import EffectLayer from "./effect-layer.vue";
import UnitLayer from "./unit-layer.vue";
import eventBus from "../../eventbus.js";
import animator from "../../animator.js";
import grid from "../../../game/grid.js";
import loadImage from "image-promise";

function loadImages() {
  return loadImage([
    "/images/grid/plain1.png",
    "/images/grid/plain2.png",
    "/images/grid/plain3.png",
    "/images/grid/plain4.png",
    "/images/grid/plain5.png",
    "/images/grid/plain6.png",
    "/images/grid/forrest1.png",
    "/images/grid/forrest2.png"
  ]).then(imgs => {
    return {
      plains: imgs.slice(0, 6),
      forrests: [imgs[6], imgs[7]]
    };
  });
}

function centerHex(stage, center, unitPos) {
  var margin = 100;
  if ((stage.getX() + center.x + unitPos.x < margin || stage.getX() + center.x + unitPos.x > container.clientWidth - margin)
    || (stage.getY() + center.y + unitPos.y < margin || stage.getY() + center.y + unitPos.y > container.clientHeight - margin)) {
    setTimeout(() => {
      stage.setX(-unitPos.x);
      stage.setY(-unitPos.y);
      //cullViews(this.visualViewport, stage, [terrainLayer, unitLayer.node, effectLayer]);
      stage.batchDraw();
    }, 0);
  }
}

export default {
  components: {
    TerrainLayer,
    EffectLayer,
    UnitLayer
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

      g.hexSelected();
      var selHex = g.getSelectedHex();
      if (selHex) {
        var unit = g.getUnitAt(selHex.x, selHex.y);
        if (g.isPlayerArmy(unit.id)) {
          args.selectedHex = selHex;
          args.unitRange = g.getSelectedHexRange();
          args.unitState = g.getSelectedHexState();
        }
        centerHex(args.$refs.stage.getStage(), args.center, selHex.center);
      }

      eventBus.publish("battlestarted");

      return g;
    }
  },
  mounted() {
    var container = document.getElementById("container");
    this.width = container.clientWidth;
    this.height = container.offsetTop;
    this.center = { x: this.width / 2, y: this.height / 2 };

    loadImages().then(images => {
      this.imageShapes = {
        plains: images.plains,
        forrests: images.forrests
      };
    });
  },
  methods: {
    handleDragStart() {
      this.listening = false;
    },
    handleDragEnd() {
      this.listening = true;
    },
    hexSelected(hex) {
      this.selectedHex = hex;
      this.grid.hexSelected(hex);
    },
    hexFocused(hex) {
      if (animator.isAnimating()) {
        return;
      }
      this.focusHex = hex;

      if (!hex) {
        return;
      }

      var aUnit = null;
      var selHex = this.grid.getSelectedHex();
      if (selHex) {
        aUnit = this.grid.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = this.grid.getUnitAt(hex.x, hex.y);
      this.unitState = this.grid.getSelectedHexState();

      if (aUnit != null && this.grid.isPlayerArmy(aUnit.id)) {
        this.path = this.grid.getPathBetween(selHex, hex);
        this.unitRange = this.grid.getSelectedHexRange();
      }

      if (this.unitState == "moving" || this.unitState == "turning") {
        if (aUnit && tUnit) {
          //tooltipLayer.updateTooltipWithUnitStats(tUnit);
        } else if (!tUnit) {
          //var cost = grid.getSelectedHexMoveCost(hex.x, hex.y);
          //tooltipLayer.updateTooltipWithMoveStats(aUnit, cost);
        }
      } else if (this.unitState == "attacking") {
        if (aUnit && tUnit) {
          //tooltipLayer.updateTooltipWithAttackStats(aUnit, tUnit);
        }
      }
    }
  },
  data() {
    return {
      imageShapes: null,
      focusHex: null,
      selectedHex: null,
      path: null,
      unitState: null,
      unitRange: null,
      listening: true,
      width: 0,
      height: 0,
      center: {},
      stageConfig: {
        width: this.width,
        height: this.height,
        draggable: true,
        dragBoundFunc: pos => {
          var ratiox = window.visualViewport.width / this.width;
          var ratioy = window.visualViewport.height / this.height;
          var margin = 50;
          var c = {
            x: pos.x,
            y: pos.y,
            sx: this.center.x / ratiox,
            sy: this.center.y / ratioy
          };
          if (Math.abs(c.x) + margin > c.sx) {
            c.x = this.$refs.stage.getStage().getAbsolutePosition().x;
          }
          if (Math.abs(c.y) + margin > c.sy) {
            c.y = this.$refs.stage.getStage().getAbsolutePosition().y;
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