<template>
  <konva-layer ref="layer" :config="{
        hitGraphEnabled : false
    }">
    <Info v-if="tooltip && tooltip.length" :text="tooltip" :pos="tooltipPosition" />
  </konva-layer>
</template>

<script>
import Info from "./info.vue";
import { getters, actions } from "../../stores/battle";
export default {
  components: {
    Info
  },
  props: {
    focusHex: Object
  },
  data() {
    return {
      tooltip: []
    }
  },
  computed: {
    center: () => getters.center(),
    tooltipPos: args => (args.tooltip && args.tooltip.length ? args.focusHex.center : {}),
    selectedHex: () => getters.selectedHex(),
    tooltipPosition: args => {
      return {
        x: args.center.x + args.tooltipPos.x,
        y: args.center.y + args.tooltipPos.y
      };
    },
    activeUnit: args => args.selectedHex ? getters.unitAt(args.selectedHex.x, args.selectedHex.y) : null,
    targetUnit: args => args.focusHex ? getters.unitAt(focusHex.x, focusHex.y) : null
  },
  watch: {
    focusHex(newVal, oldVal) {
      if (this.unitState == "moving" || this.unitState == "turning") {
        if (this.activeUnit && this.targetUnit) {
          this.updateTooltipWithUnitStats(this.targetUnit);
        } else if (this.activeUnit && !this.targetUnit) {
          var cost = this.grid.getSelectedHexMoveCost(newVal.x, newVal.y);
          this.updateTooltipWithMoveStats(this.activeUnit, cost);
        }
      } else if (this.unitState == "attacking") {
        if (this.activeUnit && this.targetUnit) {
          if (this.activeUnit.id == this.targetUnit.id) {
            this.updateTooltipWithUnitStats(this.targetUnit);
          } else {
            this.updateTooltipWithAttackStats(this.activeUnit, this.targetUnit);
          }
        }
      }
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