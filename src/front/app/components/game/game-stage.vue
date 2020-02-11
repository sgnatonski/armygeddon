<template>
  <ViewCull :stageOffset="stageOffset">
    <konva-stage
      ref="stage"
      v-if="grid"
      :config="stageConfig"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <TerrainLayer ref="terrainLayer" @selected="hexSelected" @focused="hexFocused"></TerrainLayer>
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
import eventBus from "../../eventbus.js";
import animator from "../../animator.js";
import { getters, actions } from "../../stores/battle";

function centerHex(stage, center, unitPos) {
  var margin = 100;
  if (
    stage.getX() + center.x + unitPos.x < margin ||
    stage.getX() + center.x + unitPos.x > container.clientWidth - margin ||
    stage.getY() + center.y + unitPos.y < margin ||
    stage.getY() + center.y + unitPos.y > container.clientHeight - margin
  ) {
    setTimeout(() => {
      stage.setX(-unitPos.x);
      stage.setY(-unitPos.y);
      args.stageOffset = { x: stage.getX(), y: stage.getY() };
      stage.batchDraw();
    }, 0);
  }
}

export default {
  components: {
    ViewCull,
    TerrainLayer,
    EffectLayer,
    UnitLayer
  },
  computed: {
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

      if (width < window.visualViewport.width){
        width = window.visualViewport.width;
      }
      if (height < window.visualViewport.height){
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
  data() {
    return {
      imageShapes: null,
      focusHex: null,
      path: null,
      unitState: null,
      unitRange: null,
      listening: true,
      stageOffset: { x: 0, y: 0},
    };
  },
  mounted() {
    actions.setCenter(window.innerWidth / 2, window.innerHeight / 2);
  },
  methods: {
    handleDragStart() {
      this.listening = false;
    },
    handleDragEnd() {
      this.listening = true;
    },
    hexSelected(hex) {
      actions.setSelectedHex(hex);
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
  }
};
</script>