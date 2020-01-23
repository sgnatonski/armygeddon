<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import Home from "./views/home.vue";
import { getters, mutations } from "./stores/user";

export default {
  components: {
    Home
  },
  created: function() {
    axios.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          mutations.logout();
        }
        throw err;
      });
    });
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>