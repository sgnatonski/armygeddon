<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          {{error}}
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
export default {
  components: {
    Title,
    Panel
  },
  props: ["error"],
};
</script>

<style scoped>
</style>