import axios from "axios";
import loadImage from "image-promise";
import { getters as b_getters, mutations as b_mutations } from "./battle";

function loadImages() {
    return loadImage([
        "/images/grid/plain1.png",
        "/images/grid/plain2.png",
        "/images/grid/plain3.png",
        "/images/grid/plain4.png",
        "/images/grid/plain5.png",
        "/images/grid/plain6.png",
        "/images/grid/forrest1.png",
        "/images/grid/forrest2.png"
    ]).then(imgs => {
        return {
            plains: imgs.slice(0, 6),
            forrests: [imgs[6], imgs[7]]
        };
    });
}

var loadImagesPromise = loadImages();

const state = Vue.observable({
    mode: 0,
    name: ''
});

export const getters = {
    mode: () => state.mode,
    name: () => state.name,
    selectedHex: b_getters.selectedHex
};

export const actions = {
    init() {
        var battle = {
            sceneSize: 40,
            terrain: [],
            armies: {},
            turns: [{ readyUnits: [] }]
        }
        var radius = 20;
        var cachedMap = JSON.parse(localStorage.getItem('map')) || [];
        for (var x = -radius; x <= radius; x++)
            for (var y = -radius; y <= radius; y++)
                for (var z = -radius; z <= radius; z++)
                    if (x + y + z == 0)
                        battle.terrain.push({ x: x, y: y, cost: (cachedMap.find(m => m.x == x && m.y == y) || { cost: -1 }).cost });

        loadImagesPromise.then(images => {
            b_mutations.setImageShapes(images);
            b_mutations.loadData(battle);
            setTimeout(() => {
                b_mutations.setSelectedHex(b_getters.grid().getHexAt(0, 0));
                setTimeout(() => {
                    b_mutations.setSelectedHex(null);
                }, 100);
            }, 100);
        });
    },
    save() {
        var name = prompt("Please enter battle template name");

        var terrain = b_getters.grid().getHexes().filter(h => h.cost > 0).map(h => ({
            x: h.x,
            y: h.y,
            cost: h.cost
        }));

        var data = {
            name: name,
            terrain: terrain
        };

        if (!data.name || data.name == 'default' || !data.terrain || !data.terrain.length){
            return;
        }

        axios.post('/design/save', data).then(r => {
            localStorage.removeItem('map');
        }, e => {
        });
    },
    toggleMode() {
        var mode = state.mode + 1;
        if (mode > 2) {
            mode = 0;
        }
        state.mode = mode;
    },
    setHex(hex) {
        if (!hex) {
            return;
        }
        var oldCost = hex.cost;
        switch (getters.mode()) {
            case 0: hex.cost = -1; break;
            case 1: hex.cost = hex.cost > 0 ? -1 : 1; break;
            case 2: hex.cost = hex.cost > 0 ? -1 : 2; break;
        }
        if (oldCost == hex.cost) {
            return;
        }
        var terrain = b_getters.grid().getHexes().filter(h => h.cost > 0).map(h => ({
            x: h.x,
            y: h.y,
            cost: h.cost
        }));
        localStorage.setItem('map', JSON.stringify(terrain));
        b_mutations.setAnimating(true);
        b_mutations.setTerrain(b_getters.terrain().slice());
        setTimeout(() => {
            b_mutations.setSelectedHex(null);
            b_mutations.setAnimating(false);
        }, 500);
    }
};