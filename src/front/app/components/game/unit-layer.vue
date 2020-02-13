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
import { getters, actions } from "../../stores/battle";

var armyColors = ["#12cc31", "#c80b04"];

export default {
  components: {
    Unit,
    Animator
  },
  computed: {
    center: () => getters.center(),
    units: () =>
      getters.unitHexes().map(h => {
        var u = actions.getUnitAt(h.x, h.y);
        return {
          unit: u,
          hexCenter: h.center,
          color: actions.isPlayerArmy(u) ? armyColors[0] : armyColors[1]
        };
      })
  }
};
</script>