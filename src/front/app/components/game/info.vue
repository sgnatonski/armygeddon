<template>
  <v-group :config="{ listening: false, x: posX, y: posY }">
    <v-rect
      :config="{
        width: 100,
        height: height,
        cornerRadius: 3,
        fill: 'grey',
        stroke: '#252525',
        strokeWidth: 1,
        opacity: 0.8,
        listening: false,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: {x : 6, y : 6},
        shadowOpacity: 0.5,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    />
    <v-text
      :config="{
        text: textJoined,
        fontFamily: 'Calibri',
        fontSize: 11,
        padding: 6,
        fill: '#dedede',
        listening: false,
        strokeHitEnabled: false,
        perfectDrawEnabled : false
    }"
    />
  </v-group>
</template>

<script>
import { getters, actions } from "../../stores/battle";
export default {
  props: {
    text: Array,
    pos: Object
  },
  computed: {
    posX: args => args.pos.x + 5,
    posY: args => args.pos.y + 5,
    textJoined: args => (args.text || []).join("\n"),
    height: args => 10 + (args.text.length || 1) * 11
  },
  methods: {}
};
</script>