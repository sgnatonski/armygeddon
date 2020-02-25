<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          <div>
            <v-text-field v-model="name" required label="Army name"></v-text-field>
            <v-treeview
              :items="units"
              open-all
              dense
            >
              <template v-slot:prepend="{ item }">
                <v-icon>{{ item.icon }}</v-icon>
              </template>
            </v-treeview>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
import { actions, getters } from "../stores/army";

export default {
  components: {
    Title,
    Panel
  },
  data: () => ({
    name: ''
  }),
  computed: {
    units: () =>
      (getters.army().units || []).map(u => ({
        id: u.id,
        name: u.type,
        icon: 'mdi-chess-pawn',
        children: [
          { id: u.id + "exp", name: "Exp : " + u.experience, icon: 'mdi-arm-flex' },
          { id: u.id + "rank", name: "Rank : " + u.rank, icon: 'mdi-star' }
        ]
      }))
  },
  watch:{
    units(newVal, oldVal){
      if (newVal){
        this.name = getters.army().name;
      }
    }
  },
  created() {
    actions.loadArmy();
  }
};
</script>

<style scoped>
</style>