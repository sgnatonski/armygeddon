<template>
  <konva-layer ref="layer">
    <konva-group
      v-for="hex in hexes"
      :key="hex.x + ':' + hex.y"
      :config="{
            x: center.x + hex.center.x,
            y: center.y + hex.center.y
          }"
      @click="evt => hexSelected(evt, hex)"
      @dbltap="evt => hexSelected(evt, hex)"
      @tap="evt => hexFocused(evt, hex)"
      @mouseenter="evt => hexFocused(evt, hex)"
    >
      <konva-image
        :config="{
        image: getHexTerrainImage(hex),
        width: 70,
        height: 70,
        offset: {
          x: 35,
          y: 35
        },
        opacity: 0.99,
        rotation: 30,
        listening: true,
        perfectDrawEnabled: false
      }"
      />
      <Hex />
    </konva-group>
  </konva-layer>
</template>

<script>
import Hex from "./hex.vue";
import { getters, actions } from "../../stores/battle";

export default {
  components: {
    Hex
  },
  computed:{
    imageShapes: () => getters.imageShapes(),
    center: () => getters.center(),
    hexes: () => getters.grid() ? getters.grid().getHexes() : []
  },
  methods: {
    getHexTerrainImage(hex) {
      if (hex.cost < 0) {
        return;
      } else if (hex.cost == 1) {
        var gNumber = Math.floor(Math.random() * 6);
        return this.imageShapes.plains[gNumber];
      } else {
        var gNumber = Math.floor(Math.random() * 2);
        return this.imageShapes.forrests[gNumber];
      }
    },
    hexSelected(evt, hex) {
      this.$emit("selected", hex);
    },
    hexFocused(evt, hex) {
      this.$emit("focused", hex);
    },
    hexUnfocused(evt) {
      //this.$emit("focused", null);
    }
  }
};
</script>