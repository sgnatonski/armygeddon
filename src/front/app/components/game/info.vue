<template>
  <v-group :config="{ listening: false, x: posX, y: posY }">
    <v-rect
      :config="{
        width: width,
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
      ref="text"
      :config="{
        text: textJoined,
        fontFamily: 'Calibri',
        fontSize: 12,
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
export default {
  props: {
    text: Array,
    pos: Object
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  computed: {
    posX: args => args.pos.x + 5,
    posY: args => args.pos.y + 5,
    textJoined: args => (args.text || []).join("\n")
  },
  mounted() {
    this.$nextTick(() => {
      var textRect = this.$refs.text.getNode().getClientRect();
      this.width = textRect.width;
      this.height = textRect.height;
      this.$emit('textsize', { width: textRect.width, height: textRect.height})
    });
  }
};
</script>