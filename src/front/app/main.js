import Vue from 'vue';
import vueHeadful from 'vue-headful';
import VueRouter from 'vue-router';
import VueKonva from 'vue-konva';
import App from './app.vue';
import router from './router.js';

Vue.use(VueRouter);
Vue.use(VueKonva, { prefix: 'Konva' });

Vue.component('vue-headful', vueHeadful);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});