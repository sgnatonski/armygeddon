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
      <InfoLayer ref="infoLayer" :focusHex="focusHex" :blockingInfo="blockingInfo"></InfoLayer>
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
    unitRange: () => (getters.animating() ? [] : getters.currentUnitRange()),
    unitState: () => getters.currentUnitState(),
    battleState: () => getters.battleState(),
    stageWidth: () =>
      Math.max(
        Math.abs(getters.boundingBox().minX) +
          Math.abs(getters.boundingBox().maxX) +
          60,
        window.visualViewport.width
      ),
    stageHeight: () =>
      Math.max(
        Math.abs(getters.boundingBox().minY) +
          Math.abs(getters.boundingBox().maxY) +
          60,
        window.visualViewport.width
      ),
    stageConfig: args => {
      return {
        width: args.stageWidth,
        height: args.stageHeight,
        draggable: true,
        dragBoundFunc: pos => {
          var ratiox = window.visualViewport.width / args.stageWidth;
          var ratioy = window.visualViewport.height / args.stageHeight;
          var margin = 50;
          var c = {
            x: pos.x,
            y: pos.y,
            sx: args.center.x / ratiox,
            sy: args.center.y / ratioy
          };
          if (Math.abs(c.x) + margin > c.sx) {
            c.x = args.$refs.stage.getStage().getAbsolutePosition().x;
          }
          if (Math.abs(c.y) + margin > c.sy) {
            c.y = args.$refs.stage.getStage().getAbsolutePosition().y;
          }
          args.stageOffset = { x: c.x, y: c.y };

          return args.stageOffset;
        }
      };
    }
  },
  watch: {
    animating(newVal, oldVal) {
      this.listening = !newVal;
      if (!newVal) {
        actions.updateGrid();
      }
      this.$nextTick(() => {
        this.centerHex(this.selectedHex);
        this.hexFocused(this.selectedHex);
        this.$refs.stage.getStage().batchDraw();
      });
    },
    battleState(newVal, oldVal) {
      switch (newVal) {
        case "created":
          this.blockingInfo = [
            "Sir, You're first on the battlefield.",
            "Hopefully the other army will arrive soon."
          ];
          break;
        case "ready":
          this.blockingInfo = [];
          break;
        case "started":
          this.blockingInfo = [];
          break;
        case "finished":
          this.focusHex = null;
          this.path = [];
          this.blockingInfo = ['', '', 'Battle has ended', '', '', ];
          break;
      }

    }
  },
  data() {
    return {
      imageShapes: null,
      focusHex: null,
      path: null,
      listening: true,
      stageOffset: { x: 0, y: 0 },
      blockingInfo: []
    };
  },
  mounted() {
    actions.setCenter(
      window.visualViewport.width / 2,
      window.visualViewport.height / 2
    );

    window.addEventListener("resize", () => {
      actions.setSize(
        window.visualViewport.width,
        window.visualViewport.height
      );
    });
    window.addEventListener("fullscreenchange", () => {
      actions.setSize(
        window.visualViewport.width,
        window.visualViewport.height
      );
    });

    Konva.pixelRatio = 1;
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
      if (this.animating) {
        this.focusHex = null;
        return;
      }
      this.focusHex = hex;
    },
    centerHex(hex) {
      var stage = this.$refs.stage.getStage();
      var unit = getters.unitAt(hex.x, hex.y);
      if (!unit) {
        return;
      }
      var margin = 150;
      var center = this.center;
      if (
        stage.getX() + center.x + hex.center.x < margin ||
        stage.getX() + center.x + hex.center.x > window.innerWidth - margin ||
        stage.getY() + center.y + hex.center.y < margin ||
        stage.getY() + center.y + hex.center.y > window.innerHeight - margin
      ) {
        stage.setX(-hex.center.x);
        stage.setY(-hex.center.y);
      }
      this.stageOffset = { x: stage.getX(), y: stage.getY() };
    }
  }
};
</script>