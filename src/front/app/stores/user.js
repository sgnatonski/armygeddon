import Vue from "vue";
import axios from "axios";

function doesHttpOnlyCookieExist(cookiename) {
    var d = new Date();
    d.setTime(d.getTime() + (1000));
    var expires = "expires=" + d.toUTCString();
 
    document.cookie = cookiename + "=undefined;path=/;" + expires;
    if (document.cookie.indexOf(cookiename + '=') == -1) {
        return true;
     } else {
        return false;
     }
 }

const state = Vue.observable({
    name: localStorage.getItem('username') || '',
    authenticated: false
});

export const getters = {
    name: () => state.name,
    authenticated: () => state.authenticated || doesHttpOnlyCookieExist('a_token'),
}

export const mutations = {
    login(data) {
        return new Promise((resolve, reject) => {
            axios.post('/login', data).then(r => {
                state.name = r.data.name;
                localStorage.setItem('username', state.name);
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
                localStorage.setItem('username', state.name);
                state.authenticated = true;
                resolve();
            }, e => {
                state.authenticated = false;
                reject(e.response.data.message);
            });
        });
    },
    logout() {
        state.name = '';
        state.authenticated = false;
    }
};