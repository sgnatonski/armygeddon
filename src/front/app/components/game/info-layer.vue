<template>
  <konva-layer ref="layer" :config="{
        hitGraphEnabled : blocking
    }">
    <Info v-if="tooltip && tooltip.length" :text="tooltip" :pos="tooltipPosition" />
    <konva-group v-if="blocking">
      <konva-rect
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        :config="{
        x: stageX,
        y: stageY,
        width: blockWidth,
        height: blockHeight,
        fill: 'black',
        opacity: 0.5,
        draggable: true,
        dragBoundFunc: pos => { return { x: stageX, y: stageY } }
      }"
      />
      <Info :text="blockingInfo" :pos="blockingInfoPos" />
    </konva-group>
  </konva-layer>
</template>

<script>
import Info from "./info.vue";
import { getters, actions } from "../../stores/battle";
import damage from "../../../../common/logic/damage_calculator";

export default {
  components: {
    Info
  },
  props: {
    focusHex: Object,
    blockingInfo: Array
  },
  data() {
    return {
      tooltip: [],
      blockWidth: 0,
      blockHeight: 0,
      blockInfoWidth: 400
    };
  },
  computed: {
    stageX: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().x
        : 0,
    stageY: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().y
        : 0,
    center: () => getters.center(),
    grid: () => getters.grid(),
    tooltipPos: args =>
      args.focusHex && args.tooltip && args.tooltip.length ? args.focusHex.center : { x: 0, y: 0 },
    selectedHex: () => getters.selectedHex(),
    tooltipPosition: args => {
      return {
        x: args.center.x + args.tooltipPos.x,
        y: args.center.y + args.tooltipPos.y
      };
    },
    unitState: () => getters.currentUnitState(),
    activeUnit: args =>
      args.selectedHex
        ? getters.unitAt(args.selectedHex.x, args.selectedHex.y)
        : null,
    targetUnit: args =>
      args.focusHex ? getters.unitAt(args.focusHex.x, args.focusHex.y) : null,
    blocking: args => args.blockingInfo != null && args.blockingInfo.length > 0,
    blockingInfoPos: args => {
      return {
        x: args.stageX + args.blockWidth / 2 - args.blockInfoWidth / 2,
        y: args.stageY + args.blockHeight / 2
      };
    }
  },
  watch: {
    blocking(newVal, oldVal) {
      var stage = this.$refs.layer.getStage();
      this.blockWidth = newVal ? stage.getWidth() : 0;
      this.blockHeight = newVal ? stage.getHeight() : 0;
    },
    focusHex(newVal, oldVal) {
      if (!newVal || !this.activeUnit){
        this.tooltip = null;
        return;
      }
      var unitRange = getters.currentUnitRange();
      var hexInRange = [this.selectedHex].concat(unitRange).find(x => x.x == newVal.x && x.y == newVal.y);
      if (!hexInRange){
        this.tooltip = null;
        return;
      }
      if (this.unitState == "moving" || this.unitState == "turning") {
        if (this.targetUnit) {
          this.updateTooltipWithUnitStats(this.targetUnit);
        } else {
          var cost = this.grid.getSelectedHexMoveCost(newVal.x, newVal.y);
          this.updateTooltipWithMoveStats(this.activeUnit, cost);
        }
      } else if (this.unitState == "attacking") {
        if (this.targetUnit) {
          if (this.activeUnit.id == this.targetUnit.id) {
            this.updateTooltipWithUnitStats(this.targetUnit);
          } else {
            this.updateTooltipWithAttackStats(this.activeUnit, this.targetUnit);
          }
        }
      }
    }
  },
  mounted() {
    var stage = this.$refs.layer.getStage();
    this.blockWidth = this.blocking ? stage.getWidth() : 0;
    this.blockHeight = this.blocking ? stage.getHeight() : 0;
  },
  methods: {
    handleDragStart(evt) {
      evt.evt.cancelBubble = true;
    },
    handleDragEnd(evt) {
      evt.evt.cancelBubble = true;
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