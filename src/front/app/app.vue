<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import Home from "./views/home.vue";
import { mutations } from "./stores/user";

export default {
  components: {
    Home
  },
  created: function() {
    const self = this;
    axios.interceptors.response.use(undefined, (err) => {
      return new Promise((resolve, reject) => {
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          mutations.logout();
          reject(err);
        }
        else if (err.response.status >= 500 && err.response.status < 600){
          self.$router.push({name: 'error', params: { error: err.response.data.message }});
          reject(err);
        }
        else{
          reject(err);
        }
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