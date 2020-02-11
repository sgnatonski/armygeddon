<template>
  <div id="battle-scene">
    <Menu />
    <GameStage />
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import GameStage from "../components/game/game-stage.vue";
import { actions } from "../stores/battle";

export default {
  components: {
    Menu,
    GameStage
  },
  created() {
    actions.load();
  }
};
</script>