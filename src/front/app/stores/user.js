import Vue from "vue";

const state = Vue.observable({
    name: "",
    authenticated: false
});

export const getters = {
    name: () => state.name,
    authenticated: () => state.authenticated
}

export const mutations = {
    login(name) {
        state.name = name;
        state.authenticated = true;
    },
    logout() {
        state.name = '';
        state.authenticated = false;
    }
};