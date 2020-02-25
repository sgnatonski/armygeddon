import Vue from "vue";
import axios from "axios";

const state = Vue.observable({
    army: []
});

export const getters = {
    army: () => state.army
};

export const mutations = {
};

export const actions ={
    loadArmy() {
        return new Promise((resolve, reject) => {
            axios.get('/armies').then(r => {
                state.army = r.data[0];
                resolve();
            }, e => {
                reject();
            });
        });
    }
};