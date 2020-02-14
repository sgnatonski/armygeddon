<template>
  <konva-layer ref="layer" :config="{
        hitGraphEnabled : false
    }">
    <Info v-if="tooltip" :text="tooltip" :pos="tooltipPosition" />
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
    tooltip: Array,
    tooltipPos: Object
  },
  computed: {
    center: () => getters.center(),
    tooltipPosition: args => {
      return {
        x: args.center.x + args.tooltipPos.x,
        y: args.center.y + args.tooltipPos.y
      };
    }
  },
  methods: {}
};
</script>