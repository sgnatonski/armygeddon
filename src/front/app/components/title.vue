<template>
  <div>
    <vue-headful :title="title" :description="title" />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-8"></div>
      <div class="pure-u-1 pure-u-md-3-4">
        <div class="title-box">
          <Panel>
            <h1 class="pulsate-bck">
              <router-link to="/">{{title}}</router-link>
            </h1>
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
  position: sticky;
  top: 0;
  margin-top: -20px;
}
.title-box > .panel > .slot {
  background: url(images/stone1.jpg) repeat;
  background-size: 180px 180px;
}
.title-box > .panel > .slot > h1 {
  margin-bottom: -10px;
  margin-top: -20px;
  padding-top: 16px;
  padding-left: 10px;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  margin-left: -10px;
  margin-right: -10px;
  background-size: 200% 200%;
  padding-bottom: 6px;
}

.title-box a {
  font-weight: normal;
  text-decoration-line: none;
  color: inherit;
}

.title-box > .panel > .slot .pure-menu a {
  color: antiquewhite;
}

.pulsate-bck {
  animation: pulsate-anim 0.8s ease-in-out infinite both;
}

@keyframes pulsate-anim {
  0% {
    background-position: 100% 60%;
  }
  40% {
    background-position: 100% 52%;
  }
  50% {
    background-position: 100% 68%;
  }
  65% {
    background-position: 100% 55%;
  }
  90% {
    background-position: 100% 60%;
  }
  100% {
    background-position: 100% 56%;
  }
}
</style>