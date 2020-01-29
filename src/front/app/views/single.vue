<template>
  <div id="battle-scene">
    <Menu />
    <GameStage :battle="battle" />
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import GameStage from "../components/game/game-stage.vue";
import { Battle } from "../../game/game.js";

export default {
  components: {
    Menu,
    GameStage
  },
  data: function() {
    return {
      battle: null
    }
  },
  mounted() {
    new Battle().load().then(data => {
      this.battle = data;
    });
  }
};
</script>