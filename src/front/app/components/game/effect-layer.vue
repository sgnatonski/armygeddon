<template>
  <v-fast-layer ref="layer">
    <Hex
      v-if="highlight"
      :x="center.x + highlight.center.x"
      :y="center.y + highlight.center.y"
      fill="#ffffff"
      v-bind:opacity="0.35"
    />
    <Hex
      v-if="focus"
      :x="center.x + focus.center.x"
      :y="center.y + focus.center.y"
      fill="#ffffff"
      v-bind:opacity="0.35"
    />
    <Hex
      v-for="hex in range"
      :key="hex.x + ':' + hex.y"
      :x="center.x + hex.center.x"
      :y="center.y + hex.center.y"
      :fill="getFill()"
      :opacity="getOpacity()"
    />
    <Hex
      v-for="hex in focusAttackRange"
      :key="hex.x + ':' + hex.y"
      :x="center.x + hex.center.x"
      :y="center.y + hex.center.y"
      :fill="getFill('attacking')"
      :opacity="getOpacity('attacking')"
    />
  </v-fast-layer>
</template>

<script>
import Hex from "./hex.vue";
import { getters, actions } from "../../stores/battle";
export default {
  components: {
    Hex
  },
  props: {
    highlight: Object,
    focus: Object,
    path: Array,
    range: Array,
    rangeType: String,
    attackRange: Array
  },
  computed: {
    center: () => getters.center(),
    focusAttackRange() {
      return this.rangeType == "attacking" ? [] : this.attackRange;
    }
  },
  methods: {
    getFill(type) {
      switch (type || this.rangeType) {
        case "moving":
          return "#ffffff";
        case "turning":
          return "#ffad33";
        case "attacking":
          return "#DD1111";
      }
    },
    getOpacity(type) {
      switch (type || this.rangeType) {
        case "moving":
          return 0.15;
        case "turning":
          return 0.15;
        case "attacking":
          return 0.5;
      }
    }
  }
};
</script>