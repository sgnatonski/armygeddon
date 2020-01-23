<template>
  <div>
    <vue-headful :title="title" :description="title" />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <div class="bordered-box bordered-box-min title-box">
          <div>
            <h1 v-text="title"></h1>
          </div>
          <user class="right-aligned"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "./user.vue";
export default {
  components: {
    User
  },
  data: function() {
    return {
      title: "Armygeddon"
    };
  }
};
</script>

<style scoped>
</style>