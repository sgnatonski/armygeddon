<template>
  <div id="battle-scene">
    <Panel class="battle-panel">
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
  created() {
    actions.loadDuel();
  }
};
</script>