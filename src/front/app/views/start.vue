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
              <a href="/battle" class="btn btn_normal">Start new battle</a>
              <a href="/single" class="btn btn_normal">Hot seat</a>
              <router-link to="/single" class="btn btn_normal">Hot seat (Vue)</router-link>
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
          <h2>Open battles</h2>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import Ranking from "../components/ranking.vue";
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
export default {
  components: {
    Title,
    Ranking,
    Panel
  }
};
</script>

<style scoped>
</style>