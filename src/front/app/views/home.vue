<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <div class="pure-g">
          <div class="pure-u-1 pure-u-md-2-3">
            <Panel>
              <Welcome />
            </Panel>
          </div>
          <div class="pure-u-1 pure-u-md-1-3">
            <Panel>
              <Ranking />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Welcome from "../components/welcome.vue";
import Ranking from "../components/ranking.vue";
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
export default {
  components: {
    Welcome,
    Ranking,
    Title,
    Panel
  }
};
</script>

<style scoped>
</style>