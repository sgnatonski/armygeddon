<template>
  <v-layer ref="layer" :config="{
        hitGraphEnabled : blocking
    }">
    <UnitStats :targetHex="focusHex" />
    <v-group v-if="blocking">
      <v-rect
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        :config="{
        x: stageX,
        y: stageY,
        width: blockWidth,
        height: blockHeight,
        fill: 'black',
        opacity: 0.5,
        draggable: true,
        dragBoundFunc: pos => { return { x: stageX, y: stageY } }
      }"
      />
      <Info :text="blockingInfo" :pos="blockingInfoPos" />
    </v-group>
  </v-layer>
</template>

<script>
import Info from "./info.vue";
import UnitStats from "./unit-stats.vue";
import { getters, actions } from "../../stores/battle";

export default {
  components: {
    Info,
    UnitStats
  },
  props: {
    focusHex: Object,
    blockingInfo: Array
  },
  data() {
    return {
      blockWidth: 0,
      blockHeight: 0,
      blockInfoWidth: 400
    };
  },
  computed: {
    stageX: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().x
        : 0,
    stageY: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().y
        : 0,
    blocking: args => args.blockingInfo != null && args.blockingInfo.length > 0,
    blockingInfoPos: args => {
      return {
        x: args.stageX + args.blockWidth / 2 - args.blockInfoWidth / 2,
        y: args.stageY + args.blockHeight / 2
      };
    }
  },
  watch: {
    blocking(newVal, oldVal) {
      var stage = this.$refs.layer.getStage();
      this.blockWidth = newVal ? stage.getWidth() : 0;
      this.blockHeight = newVal ? stage.getHeight() : 0;
    },
    
  },
  mounted() {
    var stage = this.$refs.layer.getStage();
    this.blockWidth = this.blocking ? stage.getWidth() : 0;
    this.blockHeight = this.blocking ? stage.getHeight() : 0;
  },
  methods: {
    handleDragStart(evt) {
      evt.evt.cancelBubble = true;
    },
    handleDragEnd(evt) {
      evt.evt.cancelBubble = true;
    }
  }
};
</script>