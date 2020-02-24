<template>
  <div id="battle-scene">
    <Panel class="battle-panel">
      <GameStage class="battle-stage" />
      <Menu :expanded="true" :items="menuItems" />
    </Panel>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import GameStage from "../components/game/game-stage.vue";
import { getters, actions } from "../stores/design";

export default {
  components: {
    Menu,
    Panel,
    GameStage
  },
  computed: {
    selectedHex: () => getters.selectedHex(),
    modeName: () => {
      switch(getters.mode()){
        case 0: return 'empty';
        case 1: return 'plain';
        case 2: return 'forrest';
      }
    },
    menuItems: args => [
      {
        name: args.modeName,
        action: actions.toggleMode,
        icon: 'hexagon-outline'
      },
      { name: "Save", action: actions.save }
    ]
  },
  data: () => {
    return { initialized: false };
  },
  watch: {
    selectedHex(newVal, oldVal) {
      if (!this.initialized) {
        this.initialized = true;
      } else {
        actions.setHex(newVal);
      }
    }
  },
  created() {
    actions.init();
  }
};
</script>