import Vue from "vue";
import axios from "axios";

const state = Vue.observable({
    openBattles: []
});

export const getters = {
    openBattles: () => state.openBattles
};

export const mutations = {
};

export const actions ={
    refreshOpenBattles() {
        return new Promise((resolve, reject) => {
            axios.get('/open').then(r => {
                state.openBattles = r.data;
                resolve();
            }, e => {
                reject();
            });
        });
    },
    joinBattle(battle){
        return new Promise((resolve, reject) => {
            sessionStorage.setItem('battle', battle.id);
            resolve();
        });
    },
    watchBattle(battle){
        return new Promise((resolve, reject) => {
            sessionStorage.setItem('battle', battle.id);
            resolve();
        });
    }
};