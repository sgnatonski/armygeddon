<template>
  <div>
    <vue-headful :title="title" :description="title" />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <div class="title-box">
          <Panel>
            <h1 v-text="title"></h1>
            <user class="right-aligned" />
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "./user.vue";
import Panel from "../components/ui/panel.vue";

export default {
  components: {
    User,
    Panel
  },
  data: function() {
    return {
      title: "Armygeddon"
    };
  }
};
</script>

<style>
.title-box {
  position: relative;
  margin-top: -20px;
}
.title-box > .panel > .slot {
  background: url(images/stone1.jpg) repeat;
  background-size: 180px 180px;
}
.title-box > .panel > .slot > h1 {
  margin-bottom: 0;
  margin-top: -20px;
  padding-top: 16px;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 40%,
    rgba(0, 0, 0, 0) 100%
  );
  margin-left: -10px;
  margin-right: -10px;
}

.title-box > .panel > .slot a {
  color: antiquewhite;
}
</style>