import Vue from 'vue';
import VueHeadful from 'vue-headful';
import App from './app.vue';

Konva.pixelRatio = 1;
Vue.component('vue-headful', VueHeadful);

export default (router) => {
    return new Vue({
        el: '#app',
        router,
        vuetify: new Vuetify({
            theme: {
                themes: {
                    light: {
                        primary: '#000000',
                        secondary: '#000000',
                        accent: '#000000',
                        error: '#b71c1c',
                        anchor: '#f7d18d',
                    },
                },
            },
        }),
        render: h => h(App),
    });
}