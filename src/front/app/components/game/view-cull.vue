<template>
  <div ref="slot">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    stageOffset: Object
  },
  watch: {
    // whenever stageX changes, this function will run
    stageOffset: function(newOffset, oldOffset) {
      var stage = this.$children[0].getStage();
      var layers = stage.children
        .forEach(l => this.cullView(this.$el, stage, l));
    }
  },
  mounted() {},
  methods: {
    cullView(container, stage, layer) {
      var c = layer.children;
      var cullMargin = 20;
      var boundingX =
        -1 * stage.getAbsolutePosition().x - layer.getX() - cullMargin;
      var boundingY =
        -1 * stage.getAbsolutePosition().y - layer.getY() - cullMargin;
      var boundingWidth = container.clientWidth + cullMargin * 2;
      var boundingHeight = container.clientHeight + cullMargin * 2;
      var x = 0;
      var y = 0;
      for (var i = 0; i < c.length; i++) {
        x = c[i].getX();
        y = c[i].getY();
        if (
          x > boundingX &&
          x < boundingX + boundingWidth &&
          y > boundingY &&
          y < boundingY + boundingHeight
        ) {
          if (!c[i].visible()) {
            c[i].show();
          }
        } else {
          c[i].hide();
        }
      }
    }
  }
};
</script>