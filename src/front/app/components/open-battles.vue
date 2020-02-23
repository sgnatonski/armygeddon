<template>
  <div>
    <h2>Open battles</h2>
    <v-list two-line>
      <v-list-item-group
        v-model="selected"
        dense
        flat
      >
        <template v-for="(item, index) in openBattles">
          <v-list-item :key="item.id">
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle class="text--primary" v-text="item.players"></v-list-item-subtitle>
                <v-list-item-subtitle v-text="item.players"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text v-text="item.created"></v-list-item-action-text>
                <v-icon
                  v-if="!active"
                  color="grey lighten-1"
                >
                  star_border
                </v-icon>

                <v-icon
                  v-else
                  color="yellow"
                >
                  star
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index + 1 < openBattles.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { actions, getters } from "../stores/realm";

export default {
  data() {
    return {
      timer: ""
    };
  },
  computed: {
    openBattles: () => getters.openBattles()
  },
  created() {
    actions.refreshOpenBattles();
    this.timer = setInterval(actions.refreshOpenBattles, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
</style>