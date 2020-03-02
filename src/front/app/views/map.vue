<template>
  <div id="map-scene">
    <Panel class="map-panel">
      <v-row justify="center" align="center">
        <v-menu v-for="t in tiles" :key="t._key">
          <template v-slot:activator="{ on }">
            <v-chip pill v-on="on" large>{{t.name}}</v-chip>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{t.name}}</v-list-item-title>
                  <v-list-item-subtitle>Owner: {{t.owner}}</v-list-item-subtitle>
                  <v-list-item-subtitle>Army: {{t.armyId}}</v-list-item-subtitle>
                  <v-list-item-subtitle>Type: {{t.type}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="menu = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-btn dark small fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card>
        </v-menu>
      </v-row>
    </Panel>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import GameStage from "../components/game/game-stage.vue";
import { getters, actions } from "../stores/realm";

export default {
  components: {
    Menu,
    Panel,
    GameStage
  },
  computed: {
    tiles: getters.map
  },
  created() {
    actions.loadMap();
  }
};
</script>