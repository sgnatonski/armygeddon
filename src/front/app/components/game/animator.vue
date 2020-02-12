<template>
  <div ref="slot">
    <slot></slot>
  </div>
</template>

<script>
import { Animation } from "konva";
import { getters, actions, mutations } from "../../stores/battle";

function getUnitMoveAnim(steps, node, center) {
  return new Promise(function(resolve, reject) {
    if (!steps || steps.length <= 1) {
      resolve();
      return;
    }

    console.log('animating');
    var currStep = steps.shift();
    var anim = new Animation((frame) => {
      var progress = frame.time / 400;
      var sourceY = center.y + currStep.center.y;
      var targetY = center.y + steps[0].center.y;
      var diffY = targetY - sourceY;
      var calcY = sourceY + diffY * progress;
      node.setY(calcY);
      var sourceX = center.x + currStep.center.x;
      var targetX = center.x + steps[0].center.x;
      var diffX = targetX - sourceX;
      var calcX = sourceX + diffX * progress;
      node.setX(calcX);
      if (
        (diffX > 0 && calcX >= targetX) ||
        (diffX < 0 && calcX <= targetX) ||
        (diffY > 0 && calcY >= targetY) ||
        (diffY < 0 && calcY <= targetY)
      ) {
        currStep = steps.shift();
        frame.time = 0; // ????????
        if (!steps.length) {
          anim.stop();
          node.setY(targetY);
          node.setX(targetX);
          resolve();
        }
      }
    }, node.getLayer());
    anim.start();
  });
}

export default {
  props: {
    unitHexes: Array
  },
  computed: {
    center: () => getters.center(),
    pendingAnimations: () => getters.pendingAnimations()
  },
  watch: {
    pendingAnimations: {
      handler(newVal, oldVal) {
        if (!newVal || Object.keys(newVal).length == 0) {
          return;
        }
        var nodes = this.$children;
        Promise.all(
          nodes.map(n =>
            getUnitMoveAnim(
              newVal[n.unit.id],
              n.$children[0].getNode(),
              this.center
            )
          )
        ).then(() => {
          mutations.setAnimating(false);
        });
      },
      deep: true
    }
  }
};
</script>