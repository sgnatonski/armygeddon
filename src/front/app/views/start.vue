<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <div class="pure-g">
          <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
            <Panel>
              <h2>Select battle</h2>
              <router-link to="/duel" class="btn btn_normal">Duel</router-link>
              <router-link to="/single" class="btn btn_normal">Hot seat</router-link>
            </Panel>
          </div>
          <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-2-3">
            <Panel>
              <Ranking />
            </Panel>
          </div>
        </div>
      </div>
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <Panel>
          <OpenBattles />
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import Ranking from "../components/ranking.vue";
import OpenBattles from "../components/open-battles.vue";
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
export default {
  components: {
    Title,
    OpenBattles,
    Ranking,
    Panel
  }
};
</script>

<style scoped>
</style>