import vueHeadful from 'vue-headful';
import VueRouter from 'vue-router';
import VueKonva from 'vue-konva';
import { JL } from 'jsnlog';
import App from './app.vue';
import router from './router.js';

Vue.component('vue-headful', vueHeadful);
Vue.use(VueKonva, { prefix: 'Konva' });
Vue.use(VueRouter);

//Vue.config.errorHandler = function(err, vm, info) { JL().error(err); }
//Vue.config.warnHandler = function(msg, vm, info) { JL().warn(msg); }

var vm = new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
