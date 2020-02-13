<template>
  <div ref="slot">
    <slot></slot>
  </div>
</template>

<script>
import { Animation } from "konva";
import { getters, actions, mutations } from "../../stores/battle";

export default {
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

        var animations = this.$children
          .filter(n => newVal[n.unit.id])
          .map(n =>
            this.getUnitMoveAnim(newVal[n.unit.id], n.$children[0].getNode())
          );

        Promise.all(animations).then(() => {
          mutations.setAnimating(false);
        });
      }
    }
  },
  methods: {
    getUnitMoveAnim(steps, node) {
      var center = this.center;
      return new Promise((resolve, reject) => {
        if (!steps || steps.length <= 1) {
          resolve();
          return;
        }

        var currStep = steps.shift();
        var anim = new Animation(frame => {
          if (!steps.length) {
            anim.stop();
            resolve();
            return;
          }

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
          }
        }, node.getLayer());
        anim.start();
      });
    }
  }
};
</script>