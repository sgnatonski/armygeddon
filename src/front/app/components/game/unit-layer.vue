<template>
  <konva-layer ref="layer" :config="{
        hitGraphEnabled : false
    }">
    <Animator :unitHexes="unitHexes">
      <Unit
        v-for="hex in unitHexes"
        :key="hex.x + ':' + hex.y"
        :center="center"
        :hexCenter="hex.center"
        :unit="getUnit(hex)"
        :color="getUnitColor(hex)"
      />
    </Animator>
  </konva-layer>
</template>

<script>
import Unit from "./unit.vue";
import Animator from "./animator.vue";
import { getters, actions } from "../../stores/battle";

var armyColors = ["#00cc00", "#c80b04"];

export default {
  components: {
    Unit,
    Animator
  },
  computed: {
    center: () => getters.center(),
    unitHexes: () => getters.unitHexes()
  },
  methods: {
    getUnit: hex => actions.getUnitAt(hex.x, hex.y),
    getUnitColor(hex) {
      var unit = actions.getUnitAt(hex.x, hex.y);
      var isPlayerArmy = actions.isPlayerArmy(unit);
      return isPlayerArmy ? armyColors[0] : armyColors[1];
    }
  }
};
</script>