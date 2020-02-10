<template>
  <konva-fast-layer ref="layer">
      <Unit
      v-for="hex in hexes"
      :key="hex.x + ':' + hex.y"
      :center="center"
      :hexCenter="hex.center"
      />
    >
  </konva-fast-layer>
</template>

<script>
import Unit from "./unit.vue";
export default {
  components: {
    Unit
  },
  data() {
    return {
      unitHexes: this.hexes.map(x => x)
    };
  },
  props: {
    hexes: null,
    center: Object
  }
};
</script>