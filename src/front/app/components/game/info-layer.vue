<template>
  <v-layer ref="layer" :config="{
        hitGraphEnabled : blocking
    }">
    <UnitStats :targetHex="focusHex" />
    <v-group v-if="blocking" :config="{
        x: stageX,
        y: stageY,
        width: width,
        height: height}">
      <v-rect
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        :config="{
        width: width,
        height: height,
        fill: 'black',
        opacity: 0.5,
        draggable: true,
        dragBoundFunc: pos => { return { x: stageX, y: stageY } }
      }"
      />
      <Info :text="blockingInfo" :pos="blockingInfoPos" @textsize="blockingSizeUpdated" />
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
    focusHex: Object
  },
  data() {
    return {
      blockingInfoWidth: 0,
      blockingInfoHeight: 0
    }
  },
  computed: {
    width: () => getters.width(),
    height: () => getters.height(),
    stageX: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().x
        : 0,
    stageY: args =>
      args.$refs.layer
        ? args.$refs.layer.getStage().getAbsolutePosition().y
        : 0,
    blockingInfo: () => {
      switch (getters.battleState()) {
        case "created":
          return [
            "Sir,",
            "",
            "You're first on the battlefield.",
            "Hopefully the other army will arrive soon.",
            ""
          ];
        case "ready":
        case "started":
          return [];
        case "finished":
          return [
            "Sir", 
            "", 
            "Battle has ended", 
            "", 
            ""];
      }
    },
    blocking: args => args.blockingInfo.length > 0,
    blockingInfoPos: args => {
      return {
        x: Math.min(args.width, window.visualViewport.width) / 2 - args.blockingInfoWidth / 2,
        y: Math.min(args.height, window.visualViewport.height) / 2 - args.blockingInfoHeight / 2
      };
    }
  },
  methods: {
    handleDragStart(evt) {
      evt.evt.cancelBubble = true;
    },
    handleDragEnd(evt) {
      evt.evt.cancelBubble = true;
    },
    blockingSizeUpdated(size){
      this.blockingInfoWidth = size.width;
      this.blockingInfoHeight = size.height;
    }
  }
};
</script>