<template>
  <konva-group
    ref="unitType"
    :config="{
        offset: {
            x: -18,
            y: -17
        }
    }"
  >
    <konva-circle
      :config="{
            radius: 10,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            offset: {
                x: -8,
                y: -8
            },
            opacity: 0.7,
            strokeHitEnabled: false,
            perfectDrawEnabled : false
        }"
    ></konva-circle>
    <konva-path v-for="part in parts" v-bind:key="part.index" :config="part.config"></konva-path>
  </konva-group>
</template>

<script>
import getShape from "../../shapes.js";

export default {
  props: { type: String },
  data() {
    return {
      parts: this.getParts()
    };
  },
  methods: {
    getShape: getShape,
    getParts() {
      switch (this.type) {
        case "inf":
          return [
            {
              index: 0,
              config: {
                data: getShape("inf1"),
                fill: "#000000",
                scale: {
                  x: 0.035,
                  y: 0.035
                },
                strokeHitEnabled: false,
                perfectDrawEnabled: false
              }
            },
            {
              index: 1,
              config: {
                data: getShape("inf2"),
                fill: "#222222",
                scale: {
                  x: 0.035,
                  y: 0.035
                },
                strokeHitEnabled: false,
                perfectDrawEnabled: false
              }
            }
          ];
        case "arch":
          return [
            {
              index: 0,
              config: {
                data: getShape("arch"),
                fill: "#000000",
                scale: {
                  x: 0.04,
                  y: 0.04
                },
                offset: {
                  x: -80,
                  y: -80
                },
                strokeHitEnabled: false,
                perfectDrawEnabled: false
              }
            }
          ];
        case "cav":
          return [
            {
              index: 0,
              config: {
                data: getShape("cav1"),
                fill: "#222222",
                scale: {
                  x: 0.2,
                  y: 0.2
                },
                strokeHitEnabled: false,
                perfectDrawEnabled: false
              }
            },
            {
              index: 1,
              config: {
                data: getShape("cav2"),
                fill: "#222222",
                scale: {
                  x: 0.2,
                  y: 0.2
                },
                strokeHitEnabled: false,
                perfectDrawEnabled: false
              }
            }
          ];
      }
    }
  }
};
</script>