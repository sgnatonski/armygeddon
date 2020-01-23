import Vue from "vue";
import axios from "axios";

const state = Vue.observable({
    name: "",
    authenticated: false
});

export const getters = {
    name: () => state.name,
    authenticated: () => state.authenticated
}

export const mutations = {
    login(data) {
        return new Promise((resolve, reject) => {
            axios.post('/login', data).then(r => {
                state.name = r.data.name;
                state.authenticated = true;
                resolve();
            }, e => {
                state.authenticated = false;
                reject();
            });
        });
    },
    register(data) {
        return new Promise((resolve, reject) => {
            axios.post('/register', data).then(r => {
                state.name = r.data.name;
                state.authenticated = true;
                resolve();
            }, e => {
                state.authenticated = false;
                reject();
            });
        });
    },
    logout() {
        state.name = '';
        state.authenticated = false;
    }
};