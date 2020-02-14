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
      <InfoLayer ref="infoLayer" :tooltip="tooltip" :tooltipPos="tooltipPos"></InfoLayer>
    </konva-stage>
  </ViewCull>
</template>

<script>
import ViewCull from "./view-cull.vue";
import TerrainLayer from "./terrain-layer.vue";
import EffectLayer from "./effect-layer.vue";
import UnitLayer from "./unit-layer.vue";
import InfoLayer from "./info-layer.vue";
import eventBus from "../../eventBus.js";
import { getters, actions } from "../../stores/battle";
import damage from "../../../../common/logic/damage_calculator";

export default {
  components: {
    ViewCull,
    TerrainLayer,
    EffectLayer,
    UnitLayer,
    InfoLayer
  },
  computed: {
    animating: () => getters.animating(),
    selectedHex: () => getters.selectedHex(),
    tooltipPos: args => (args.tooltip ? args.focusHex.center : {}),
    grid: () => getters.grid(),
    center: () => getters.center(),
    unitRange: () => (getters.animating() ? [] : getters.currentUnitRange()),
    unitState: () => getters.currentUnitState(),
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
      this.listening = !newVal;
      if (!newVal) {
        actions.updateGrid();
      }
      this.$nextTick(() => {
        this.centerHex(this.selectedHex);
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
      listening: true,
      stageOffset: { x: 0, y: 0 },
      tooltip: null
    };
  },
  mounted() {
    actions.setCenter(window.visualViewport.width / 2, window.visualViewport.height / 2);
    
    window.addEventListener('resize', () => {
      actions.setSize(window.visualViewport.width, window.visualViewport.height);
    });
    window.addEventListener('fullscreenchange', () => {
      actions.setSize(window.visualViewport.width, window.visualViewport.height);
    });

    Konva.pixelRatio = 1;
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
      this.tooltip = null;
      if (this.animating) {
        this.focusHex = null;
        return;
      }
      this.focusHex = hex;

      var aUnit = null;
      var selHex = this.selectedHex;
      if (selHex) {
        aUnit = getters.unitAt(selHex.x, selHex.y);
      }
      var tUnit = getters.unitAt(hex.x, hex.y);
      if (this.unitState == "moving" || this.unitState == "turning") {
        if (aUnit && tUnit) {
          this.updateTooltipWithUnitStats(tUnit);
        } else if (aUnit && !tUnit) {
          var cost = this.grid.getSelectedHexMoveCost(hex.x, hex.y);
          this.updateTooltipWithMoveStats(aUnit, cost);
        }
      } else if (this.unitState == "attacking") {
        if (aUnit && tUnit) {
          if (aUnit.id == tUnit.id){
            this.updateTooltipWithUnitStats(tUnit);
          }
          else {
            this.updateTooltipWithAttackStats(aUnit, tUnit);
          }
        }
      }
    },
    centerHex(hex) {
      var stage = this.$refs.stage.getStage();
      var unit = getters.unitAt(hex.x, hex.y);
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
      }
      this.stageOffset = { x: stage.getX(), y: stage.getY() };
    },
    updateTooltipWithUnitStats(unit) {
      var texts = [
        `Endurance: ${unit.endurance} / ${unit.lifetime.endurance}`,
        `Mobility: ${unit.mobility} / ${unit.lifetime.mobility}`,
        `Agility: ${unit.agility} / ${unit.lifetime.agility}`,
        `Damage: ${unit.damage}`,
        `Armor: ${unit.armor}`,
        `Range: ${unit.range}`
      ];
      this.tooltip = texts;
    },
    updateTooltipWithMoveStats(unit, cost) {
      if (cost <= unit.mobility) {
        var texts = [`Moves: ${cost} / ${unit.mobility}`];
        if (unit.range == 1) {
          texts.push(`Charge: +${cost}`);
        }
        if (unit.agility && cost == unit.mobility) {
          texts.push(`Agility: -${unit.agility}`);
        }
        this.tooltip = texts;
      }
    },
    updateTooltipWithAttackStats(aUnit, tUnit) {
      var dmg = damage.getChargeDamage(aUnit, tUnit);
      var texts = [`Endurance: ${tUnit.endurance}`, `-${dmg} damage`];
      this.tooltip = texts;
    }
  }
};
</script>