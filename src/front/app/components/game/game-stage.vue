<template>
  <ViewCull :stageOffset="stageOffset">
    <konva-stage
      ref="stage"
      v-if="grid"
      :config="stageConfig"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <TerrainLayer ref="terrainLayer" @focused="hexFocused"></TerrainLayer>
      <EffectLayer
        ref="effectLayer"
        :highlight="selectedHex"
        :focus="focusHex"
        :path="path"
        :range="unitRange"
        :rangeType="unitState"
      ></EffectLayer>
      <UnitLayer ref="unitLayer"></UnitLayer>
    </konva-stage>
  </ViewCull>
</template>

<script>
import ViewCull from "./view-cull.vue";
import TerrainLayer from "./terrain-layer.vue";
import EffectLayer from "./effect-layer.vue";
import UnitLayer from "./unit-layer.vue";
import eventBus from "../../eventBus.js";
import { getters, actions } from "../../stores/battle";

export default {
  components: {
    ViewCull,
    TerrainLayer,
    EffectLayer,
    UnitLayer
  },
  computed: {
    animating: () => getters.animating(),
    selectedHex: () => getters.selectedHex(),
    grid: () => getters.grid(),
    center: () => getters.center(),
    stageConfig: args => {
      var width =
        Math.abs(getters.boundingBox().minX) +
        Math.abs(getters.boundingBox().maxX) +
        60;
      var height =
        Math.abs(getters.boundingBox().minY) +
        Math.abs(getters.boundingBox().maxY) +
        60;

      if (width < window.visualViewport.width) {
        width = window.visualViewport.width;
      }
      if (height < window.visualViewport.height) {
        height = window.visualViewport.height;
      }

      return {
        width: width,
        height: height,
        draggable: true,
        dragBoundFunc: pos => {
          var ratiox = window.visualViewport.width / width;
          var ratioy = window.visualViewport.height / height;
          var margin = 50;
          var c = {
            x: pos.x,
            y: pos.y,
            sx: args.center.x / ratiox,
            sy: args.center.y / ratioy
          };
          if (Math.abs(c.x) + margin > c.sx) {
            c.x = args.$refs.stage.getStage().getAbsolutePosition().x;
          }
          if (Math.abs(c.y) + margin > c.sy) {
            c.y = args.$refs.stage.getStage().getAbsolutePosition().y;
          }
          args.stageOffset = { x: c.x, y: c.y };

          return args.stageOffset;
        }
      };
    }
  },
  watch: {
    animating(newVal, oldVal) {
      this.$nextTick().then(() => {
        if (newVal){
          this.unitRange = [];
        }
        else {
          actions.updateGrid();
        }
        this.centerHex(this.$refs.stage.getStage(), this.selectedHex);
        this.hexFocused(this.selectedHex);
        this.$refs.stage.getStage().batchDraw();
      });
    }
  },
  data() {
    return {
      imageShapes: null,
      focusHex: null,
      path: null,
      unitState: null,
      unitRange: null,
      listening: true,
      stageOffset: { x: 0, y: 0 }
    };
  },
  mounted() {
    actions.setCenter(window.innerWidth / 2, window.innerHeight / 2);
    eventBus.on("battlewaiting", () => {
      console.log("battlewaiting");
      /*waitLayer.show([
        "Sir, You're first on the battlefield.",
        "Hopefully the other army will arrive soon."
      ]);*/
    });

    eventBus.on("battlestarted", () => {
      console.log("battlestarted");
      //waitLayer.hide();
    });

    eventBus.on("battleended", result => {
      this.focusHex = null;
      this.path = [];
      this.unitRange = [];
      /*effectLayer.highlightNode(null);
      effectLayer.drawPath([]);
      effectLayer.highlightRange([], grid.getSelectedHexState());*/
      //grid.hexSelected();
      //tooltipLayer.hideTooltip();
      //waitLayer.show(["Battle has ended", ...result]);
    });

    eventBus.on("battlestate", txt => {
      console.log(txt);
    });
  },
  methods: {
    handleDragStart() {
      this.listening = false;
    },
    handleDragEnd() {
      this.listening = true;
    },
    hexFocused(hex) {
      if (this.animating) {
        return;
      }
      this.focusHex = hex;

      var aUnit = null;
      var selHex = this.selectedHex;
      if (selHex) {
        aUnit = actions.getUnitAt(selHex.x, selHex.y);
      }
      var tUnit = actions.getUnitAt(hex.x, hex.y);
      this.unitState = this.grid.getSelectedHexState();

      if (aUnit != null && actions.isPlayerArmy(aUnit.id)) {
        this.unitRange = this.grid.getSelectedHexRange();
        //this.path = this.grid.getPathBetween(selHex, hex);
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
    },
    centerHex(stage, hex) {
      var unit = actions.getUnitAt(hex.x, hex.y);
      if (!unit) {
        return;
      }
      var margin = 150;
      var center = getters.center();
      if (
        stage.getX() + center.x + hex.center.x < margin ||
        stage.getX() + center.x + hex.center.x > window.innerWidth - margin ||
        stage.getY() + center.y + hex.center.y < margin ||
        stage.getY() + center.y + hex.center.y > window.innerHeight - margin
      ) {
        stage.setX(-hex.center.x);
        stage.setY(-hex.center.y);
        this.stageOffset = { x: stage.getX(), y: stage.getY() };        
      }
    }
  }
};
</script>