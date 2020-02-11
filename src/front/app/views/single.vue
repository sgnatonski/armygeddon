<template>
  <div id="battle-scene">
    <Menu />
    <Panel class="battle-panel">
      <GameStage class="battle-stage" />
    </Panel>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import GameStage from "../components/game/game-stage.vue";
import { actions } from "../stores/battle";

export default {
  components: {
    Menu,
    Panel,
    GameStage
  },
  created() {
    actions.load();
  }
};
</script>

<style scoped>
.battle-panel {
  margin: -5px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.battle-stage {
  margin: -10px;
  position: absolute;
}
</style>