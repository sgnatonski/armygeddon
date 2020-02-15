import Vue from 'vue';
import vueHeadful from 'vue-headful';
import VueRouter from 'vue-router';
import VueKonva from 'vue-konva';
import { JL } from 'jsnlog';
import App from './app.vue';
import router from './router.js';

JL().debug("log entry from frontend");

Vue.use(VueRouter);
Vue.use(VueKonva, { prefix: 'Konva' });

Vue.component('vue-headful', vueHeadful);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});