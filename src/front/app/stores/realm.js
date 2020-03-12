import Vue from "vue";
import axios from "axios";

const state = Vue.observable({
    openBattles: [],
    map: [],
    mapPoints: []
});

export const getters = {
    openBattles: () => state.openBattles,
    map: () => state.map,
    mapPoints: () => state.mapPoints
};

export const mutations = {
};

export const actions ={
    loadMap(){
        return new Promise((resolve, reject) => {
            axios.get('/map').then(r => {
                state.map = r.data;
                window.TEST_mapPoints = Uint16Array.from(r.data);
                resolve();
            }, e => {
                reject();
            });
        });
    },
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
            sessionStorage.setItem('battleid', battle.id);
            resolve();
        });
    },
    watchBattle(battle){
        return new Promise((resolve, reject) => {
            sessionStorage.setItem('battleid', battle.id);
            resolve();
        });
    }
};