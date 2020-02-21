<template>
  <ViewCull :stageOffset="stageOffset">
    <v-stage
      ref="stage"
      v-if="grid"
      :config="stageConfig"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <TerrainLayer ref="terrainLayer" @focused="hexFocused"></TerrainLayer>
      <EffectLayer
        ref="effectLayer"
        :highlight="selectedHex"
        :focus="focusHex"
        :path="path"
        :range="unitRange"
        :rangeType="unitState"
      ></EffectLayer>
      <UnitLayer ref="unitLayer"></UnitLayer>
      <InfoLayer ref="infoLayer" :focusHex="focusHex"></InfoLayer>
    </v-stage>
  </ViewCull>
</template>

<script>
import ViewCull from "./view-cull.vue";
import TerrainLayer from "./terrain-layer.vue";
import EffectLayer from "./effect-layer.vue";
import UnitLayer from "./unit-layer.vue";
import InfoLayer from "./info-layer.vue";
import { getters, actions } from "../../stores/battle";

export default {
  components: {
    ViewCull,
    TerrainLayer,
    EffectLayer,
    UnitLayer,
    InfoLayer
  },
  computed: {
    animating: () => getters.animating(),
    selectedHex: () => getters.selectedHex(),
    grid: () => getters.grid(),
    center: () => getters.center(),
    unitRange: () => getters.currentUnitRange(),
    unitState: () => getters.currentUnitState(),
    stageWidth: () => Math.min(getters.width(), window.visualViewport.width),
    stageHeight: () => Math.min(getters.height(), window.visualViewport.height),
    stageConfig: args => {
      return {
        width: args.stageWidth,
        height: args.stageHeight,
        draggable: true,
        dragBoundFunc: pos => args.sceneBoundFunc(args, pos)
      };
    }
  },
  watch: {
    selectedHex(newVal, oldVal) {
      this.$nextTick(() => {
        this.centerHex(newVal);
        this.hexFocused(newVal);
        this.$refs.stage.getStage().batchDraw();
      });
    },
    animating(newVal, oldVal) {
      this.listening = !newVal;
      if (this.listening) {
        actions.updateGrid();
      }
    }
  },
  data() {
    return {
      imageShapes: null,
      focusHex: null,
      path: null,
      listening: true,
      stageOffset: { x: 0, y: 0 }
    };
  },
  methods: {
    handleDragStart() {
      this.listening = false;
    },
    handleDragEnd() {
      this.listening = true;
    },
    hexFocused(hex) {
      this.tooltip = null;
      this.focusHex = this.animating ? null : hex;
    },
    centerHex(hex) {
      var unit = getters.unitAt(hex.x, hex.y);
      if (!unit) {
        return;
      }
      var margin = 150;
      var center = this.center;
      var stage = this.$refs.stage.getStage();
      var c = {
        x: stage.getX(),
        y: stage.getY()
      };
      if (
        stage.getX() + center.x + hex.center.x < margin ||
        stage.getX() + center.x + hex.center.x > this.stageWidth - margin ||
        stage.getY() + center.y + hex.center.y < margin ||
        stage.getY() + center.y + hex.center.y > this.stageHeight - margin
      ) {
        c.x = -(center.x + hex.center.x - this.stageWidth / 2);
        c.y = -(center.y + hex.center.y - this.stageHeight / 2);
        this.sceneBoundFunc(this, c);
      }
      stage.setX(this.stageOffset.x);
      stage.setY(this.stageOffset.y);
    },
    sceneBoundFunc: (args, pos) => {
      var bb = getters.boundingBox();
      var center = getters.center();
      var margin = 34;
      var c = {
        x: pos.x,
        y: pos.y
      };
      if (pos.x > margin) {
        c.x = margin;
      } else if (-pos.x > bb.maxX + center.x - args.stageWidth + margin) {
        c.x = -(bb.maxX + center.x - args.stageWidth + margin);
      }
      if (pos.y > margin) {
        c.y = margin;
      } else if (-pos.y > bb.maxY + center.y - args.stageHeight + margin) {
        c.y = -(bb.maxY + center.y - args.stageHeight + margin);
      }
      args.stageOffset = { x: c.x, y: c.y };

      return args.stageOffset;
    }
  }
};
</script>