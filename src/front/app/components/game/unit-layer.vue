<template>
  <konva-layer ref="layer" :config="{
        hitGraphEnabled : false
    }">
    <Animator>
      <Unit
        v-for="u in units"
        :key="u.unit.pos.x + ':' + u.unit.pos.y"
        :center="center"
        :hexCenter="u.hexCenter"
        :unit="u.unit"
        :color="u.color"
      />
    </Animator>
  </konva-layer>
</template>

<script>
import Unit from "./unit.vue";
import Animator from "./animator.vue";
import { getters } from "../../stores/battle";

var armyColors = ["#12cc31", "#c81b14"];

export default {
  components: {
    Unit,
    Animator
  },
  computed: {
    center: () => getters.center(),
    playerArmy: () => getters.selfArmy(),
    units: args =>
      getters.unitHexes().map(h => {
        var u = getters.unitAt(h.x, h.y);
        if (!u){
          return null;
        }
        return {
          unit: u,
          hexCenter: h.center,
          color: getters.army(u.id).playerId == args.playerArmy ? armyColors[0] : armyColors[1]
        };
      }).filter(u => u !== null)
  }
};
</script>