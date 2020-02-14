<template>
  <div id="battle-scene">
    <Panel class="battle-panel" :style="{ 'height': `${height}px` }">
      <GameStage class="battle-stage" />
    </Panel>
    <Menu />
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import GameStage from "../components/game/game-stage.vue";
import { getters, actions } from "../stores/battle";

export default {
  components: {
    Menu,
    Panel,
    GameStage
  },
  computed: {
    height: () => getters.height
  },
  created() {
    actions.load();
  }
};
</script>

<style>
#battle-scene{
  overflow: hidden;
}
.panel.battle-panel {
  margin: -5px;
  position: sticky;
  overflow: hidden;
}

.panel.battle-panel > .slot {
  overflow: hidden;
  margin: -21px;
}

.panel.battle-panel > :not(.slot) {
  z-index: 10;
}
</style>