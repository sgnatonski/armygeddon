<template>
  <konva-group :config="{ listening: false, x: unitStatPos.x, y: unitStatPos.y }">
    <konva-rect
      v-if="activeStats || targetStats"
      :config="{
        width: width,
        height: height,
        cornerRadius: 3,
        fill: 'grey',
        stroke: '#252525',
        strokeWidth: 1,
        opacity: 0.8,
        listening: false,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: {x : 6, y : 6},
        shadowOpacity: 0.5,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    />
    <konva-text
      v-if="activeStats"
      :config="{
        x: !targetUnit || selectedHex.center.x <= targetHex.center.x ? 0 : width / 2,
        text: activeUnitStats,
        fontFamily: 'Calibri',
        fontSize: 11,
        padding: 6,
        fill: '#dedede',
        listening: false,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    />
    <konva-text
      v-if="targetStats"
      :config="{
        x: selectedHex.center.x > targetHex.center.x ? 0 : width / 2,
        text: targetUnitStats,
        fontFamily: 'Calibri',
        fontSize: 11,
        padding: 6,
        fill: '#dedede',
        listening: false,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    />
  </konva-group>
</template>

<script>
import { getters, actions } from "../../stores/battle";
import damage from "../../../../common/logic/damage_calculator";

export default {
  props: {
    targetHex: Object
  },
  data() {
    return {
      activeStats: null,
      targetStats: null
    };
  },
  computed: {
    activeUnitStats: args => (args.activeStats || []).join("\n"),
    targetUnitStats: args => (args.targetStats || []).join("\n"),
    width: args => 120 * (args.targetStats ? 2 : 1),
    height: args =>
      args.activeStats ? 10 + (args.activeStats.length || 1) * 11 : 0,
    center: () => getters.center(),
    grid: () => getters.grid(),
    selectedHex: () => getters.selectedHex(),
    unitState: () => getters.currentUnitState(),
    moveCost: args =>
      args.grid.getSelectedHexMoveCost(args.targetHex.x, args.targetHex.y),
    activeUnit: args =>
      args.selectedHex
        ? getters.unitAt(args.selectedHex.x, args.selectedHex.y)
        : null,
    targetUnit: args =>
      args.targetHex
        ? getters.unitAt(args.targetHex.x, args.targetHex.y)
        : null,
    unitStatPos: args =>
      args.selectedHex
        ? {
            x: args.selectedHex.center.x + args.center.x + -args.width / 2,
            y: args.selectedHex.center.y + args.center.y + 26
          }
        : { x: 0, y: 0 }
  },
  watch: {
    targetHex(newVal, oldVal) {
      this.targetStats = null;
      if (!newVal || !this.activeUnit) {
        this.activeStats = null;
        return;
      }
      var unitRange = getters.currentUnitRange();
      var hexInRange = [this.selectedHex]
        .concat(unitRange)
        .find(x => x.x == newVal.x && x.y == newVal.y);
      if (!hexInRange) {
        this.activeStats = null;
        return;
      }

      this.activeStats = this.getActiveUnitStats();
      this.targetStats =
        this.targetUnit &&
        this.activeUnit.id != this.targetUnit.id &&
        this.unitState == "attacking"
          ? this.getTargetUnitStats()
          : null;
    }
  },
  methods: {
    getActiveUnitStats() {
      var end = this.getEndurance(this.activeUnit, this.unitState);
      var mob = this.getMobility(this.activeUnit, this.unitState);
      var agi = this.getAgility(this.activeUnit);
      var dam = this.getImpact(this.activeUnit);
      var texts = [
        `Endurance: ${Math.max(0, end.current + end.delta)} / ${end.lifetime}`,
        `Mobility: ${Math.max(0, mob.current + mob.delta)} / ${mob.lifetime}`,
        `Agility: ${Math.max(0, agi.current + agi.delta)} / ${agi.lifetime}`,
        `Impact: ${Math.max(0, dam.current + dam.delta)} / ${dam.lifetime} ${
          dam.delta != 0 ? `(Charge +${dam.delta})` : ""
        }`,
        `Armor: ${this.activeUnit.armor}`,
        `Range: ${this.activeUnit.range}`
      ];
      return texts;
    },
    getTargetUnitStats() {
      var end = this.getEstimatedEndurance(this.targetUnit, this.unitState);
      var mob = this.getMobility(this.targetUnit, this.unitState);
      var agi = this.getAgility(this.targetUnit);
      var dam = this.getImpact(this.targetUnit);
      var texts = [
        `Endurance: ${Math.max(0, end.current + end.delta)} / ${end.lifetime}`,
        `Mobility: ${Math.max(0, mob.current + mob.delta)} / ${mob.lifetime}`,
        `Agility: ${Math.max(0, agi.current + agi.delta)} / ${agi.lifetime}`,
        `Impact: ${Math.max(0, dam.current + dam.delta)} / ${dam.lifetime} ${
          dam.delta != 0 ? `(Charge +${dam.delta})` : ""
        }`,
        `Armor: ${this.targetUnit.armor}`,
        `Range: ${this.targetUnit.range}`
      ];
      return texts;
    },
    getEndurance(unit, state) {
      return {
        current: unit.endurance,
        delta: 0,
        lifetime: unit.lifetime.endurance
      };
    },
    getEstimatedEndurance(unit, state) {
      var delta = damage.getChargeDamage(this.activeUnit, this.targetUnit);
      return {
        current: unit.endurance,
        delta: -delta,
        lifetime: unit.lifetime.endurance
      };
    },
    getMobility(unit, state) {
      return {
        current: unit.mobility,
        delta: state == "moving" ? -this.moveCost : 0,
        lifetime: unit.lifetime.mobility
      };
    },
    getAgility(unit) {
      var delta =
        unit.agility && this.moveCost == unit.mobility ? unit.agility : 0;
      return {
        current: unit.agility,
        delta: -delta,
        lifetime: unit.lifetime.agility
      };
    },
    getRange(unit) {
      return {
        current: unit.range,
        delta: 0,
        lifetime: unit.lifetime.range
      };
    },
    getImpact(unit) {
      var delta = unit.range == 1 && this.moveCost > 1 ? this.moveCost : 0;
      return {
        current: unit.damage + unit.charge,
        delta: delta,
        lifetime: unit.damage
      };
    }
  }
};
</script>