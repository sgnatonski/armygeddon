import Vue from 'vue';
import vueInit from './vue.init';

Vue.config.errorHandler = function(err, vm, info) { JL().error(err); }
Vue.config.warnHandler = function(msg, vm, info) { JL().warn(msg); }

vueInit();