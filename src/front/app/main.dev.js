import Vue from 'vue';
import VueHeadful from 'vue-headful';
import App from './app.vue';
import router from './router.js';

Konva.pixelRatio = 1;
Vue.component('vue-headful', VueHeadful);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
