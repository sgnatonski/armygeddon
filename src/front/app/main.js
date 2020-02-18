import Vue from 'vue';
import vueHeadful from 'vue-headful';
import VueRouter from 'vue-router';
import VueKonva from 'vue-konva';
import { JL } from 'jsnlog';
import App from './app.vue';
import router from './router.js';

Vue.use(VueRouter);
Vue.use(VueKonva, { prefix: 'Konva' });

Vue.component('vue-headful', vueHeadful);

Vue.config.errorHandler = function(err, vm, info) { JL().error(err); throw err; }
Vue.config.warnHandler = function(msg, vm, info) { JL().warn(msg); throw msg; }

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});