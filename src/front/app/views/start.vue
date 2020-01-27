<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-3">
        <Panel>
          <h2>Select battle</h2>
          <ul class="select-list">
            <li>
              <a href="/battle">Start new battle</a>
            </li>
            <li>
              <a href="/single">Hot seat</a>
            </li>
          </ul>
        </Panel>
        <Panel>
          <Ranking />
        </Panel>
      </div>
      <div class="pure-u-1 pure-u-md-2-3">
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