<template>
  <konva-layer ref="layer"
    :config="{
        hitGraphEnabled : false
    }">
    <Unit
      v-for="hex in hexes"
      :key="hex.x + ':' + hex.y"
      :center="center"
      :hexCenter="hex.center"
      :unit="getUnit(hex)"
      :color="getUnitColor(hex)"
    />>
  </konva-layer>
</template>

<script>
import Unit from "./unit.vue";
import { getters, actions } from "../../stores/battle";

var armyColors = ["#00cc00", "#c80b04"];
      
export default {
  components: {
    Unit
  },
  computed:{
    center: () => getters.center(),
    hexes: () => getters.grid() ? getters.grid().getHexes().filter(h => actions.getUnitAt(h.x, h.y)) : []
  },
  methods: {
    getUnit: (hex) => actions.getUnitAt(hex.x, hex.y),
    getUnitColor(hex) {
      var unit = actions.getUnitAt(hex.x, hex.y);
      var isPlayerArmy = actions.isPlayerArmy(unit);
      return isPlayerArmy ? armyColors[0] : armyColors[1];
    }
  }
};
</script>