<template>
  <konva-fast-layer ref="layer">
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
  </konva-fast-layer>
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
    rangeType: String
  },
  computed:{
    center: () => getters.center()
  },
  methods: {
      getFill(){
          switch(this.rangeType){
              case 'moving': return '#ffffff';
              case 'turning': return '#ffad33';
              case 'attacking': return '#DD1111';
          }
      },
      getOpacity(){
          switch(this.rangeType){
              case 'moving': return 0.15;
              case 'turning': return 0.15;
              case 'attacking': return 0.5;
          }
      }
  }
};
</script>