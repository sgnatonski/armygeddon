import Vue from "vue";
import loadImage from "image-promise";
import eventBus from "../eventBus";
import Army from "../../game/army";
import Grid from "../../game/grid";
import Requests from "../../game/requests/requests";

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

function initialState() {
    return Vue.observable({
        center: { x: 0, y: 0 },
        width: 0,
        height: 0,
        boundingBox: null,
        sceneSize: '',
        grid: null,
        imageShapes: [],
        animating: true,
        pendingAnimations: {},
        battleState: '',
        battleId: '',
        selfArmy: null,
        terrain: null,
        unitQueue: [],
        firstArmy: null,
        secondArmy: null,
        nextPlayer: null,
        winningArmy: null,
        selectedHex: null,
        unitHexes: [],
        targetUnit: null,
        currentUnit: null,
        update: null
    });
}

var state = initialState();

export const getters = {
    animating: () => state.animating,
    pendingAnimations: () => state.pendingAnimations,
    center: () => state.center,
    width: () => state.width,
    height: () => state.height,
    boundingBox: () => state.boundingBox,
    grid: () => state.grid,
    selectedHex: () => state.selectedHex,
    imageShapes: () => state.imageShapes,
    sceneSize: () => state.sceneSize,
    battleState: () => state.battleState,
    battleId: () => state.battleId,
    selfArmy: () => state.selfArmy,
    terrain: () => state.terrain,
    unitQueue: () => state.unitQueue,
    firstArmy: () => state.firstArmy,
    secondArmy: () => state.secondArmy,
    currentUnit: () => state.currentUnit,
    update: () => state.update,
    currentUnitRange: () => {
        if (!state.animating && state.currentUnit && getters.isPlayerArmy(state.currentUnit.id)) {
            return state.grid.getSelectedHexRange();
            // disabled of performance reasons
            //this.path = this.grid.getPathBetween(selHex, hex);
        }
        return [];
    },
    currentUnitState: () => {
        if (!state.animating && state.currentUnit && getters.isPlayerArmy(state.currentUnit.id)) {
            return state.grid.getSelectedHexState();
        }
        return null;
    },
    targetUnit: () => state.targetUnit,
    nextUnit: () => getters.units().find(u => u.id == state.unitQueue[0]),
    nextPlayer: () => actions.getArmy(nextUnit).playerName,
    winningArmy: () => state.winningArmy,
    unitHexes: () => state.unitHexes,
    units: () => {
        if (!state.firstArmy) {
            return null;
        }
        if (!state.secondArmy) {
            return state.firstArmy.getArmy();
        }
        return state.firstArmy.getArmy().concat(state.secondArmy.getArmy());
    },
    unit: (unitId) => getters.units().find(u => u.id == unitId),
    army(unitId) {
        return state.firstArmy.getArmy().some(x => x.id == unitId)
            ? state.firstArmy
            : state.secondArmy;
    },
    opposingArmy(unitId) {
        return state.firstArmy.getArmy().some(x => x.id == unitId)
            ? state.secondArmy
            : state.firstArmy;
    },
    unitAt(x, y) {
        return getters.units().find(u => u.pos.x == x && u.pos.y == y);
    },
    unitState(unit) {
        if (!unit) {
            return 'none';
        }
        if (unit.endurance <= 0) {
            return 'dead';
        }
        if (unit.mobility > 0) {
            return 'moving';
        }
        if (unit.agility > 0) {
            return 'turning';
        }
        if (unit.attacks > 0) {
            return 'attacking';
        }
    },
    isPlayerArmy(unitId, exactMatch) {
        var army = getters.army(unitId);
        if (exactMatch) {
            return state.selfArmy === army.playerId;
        }

        return state.selfArmy === army.playerId
            || '_' + state.selfArmy === army.playerId
            || state.selfArmy === '_' + army.playerId;
    },
}

export const mutations = {
    loadData(data) {
        var armies = Object.keys(data.armies).map(key => data.armies[key]);
        state.battleState = 'created';
        state.battleId = data.id;
        state.selfArmy = data.selfArmy;
        state.terrain = data.terrain;
        state.sceneSize = data.sceneSize;
        state.unitQueue = data.turns[data.turns.length - 1].readyUnits;
        state.firstArmy = new Army(armies[0], data.unitTypes);

        state.grid = Grid(state.sceneSize, state.terrain, getters, actions);

        var { minX, minY, maxX, maxY } = state.grid.initDrawing(state.center);
        state.boundingBox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        
        mutations.setSize(Math.abs(state.boundingBox.minX) + Math.abs(state.boundingBox.maxX), Math.abs(state.boundingBox.minY) + Math.abs(state.boundingBox.maxY));
        
        if (armies.length == 2) {
            state.secondArmy = new Army(armies[1], data.unitTypes);
            state.battleState = 'ready';
            state.winningArmy = data.winningArmy;
            if (state.winningArmy) {
                mutations.end(data);
            }
        }
        
        eventBus.on('update', mutations.update);
        eventBus.on('end', mutations.end);
        mutations.setAnimating(false);
    },
    update(data) {
        state.update = data;
        state.battleState = 'started';
        state.unitQueue = data.unitQueue;
        state.targetUnit = data.currUnit.pos;
        actions.animateUnit(state.currentUnit, data.currUnit.pos);
    },
    end(data) {
        state.update = data;
        state.battleState = 'finished';
        state.unitQueue = [];
    },
    setSize(width, height) {
        state.width = width;
        state.height = height;
        state.center = { x: width / 2, y: height / 2 };
    },
    setSelectedHex(hex) {
        state.selectedHex = hex;
    },
    setCurrentUnit(unit) {
        var nextHex = getters.grid().getHexAt(unit.pos.x, unit.pos.y);
        mutations.setSelectedHex(nextHex);
        state.currentUnit = unit;
    },
    setUnitHexes() {
        state.unitHexes = getters.units().map(u => getters.grid().getHexAt(u.pos.x, u.pos.y));
        getters.grid().setBlocked(getters.units());
    },
    setPendingAnimations(unit, animation) {
        if (!unit || !animation) {
            state.pendingAnimations = {};
        }
        else {
            state.pendingAnimations[unit.id] = animation;
            state.pendingAnimations = Object.assign({}, state.pendingAnimations);
        }
    },
    setAnimating(anim) {
        if (!anim) {
            mutations.setPendingAnimations(null);
        }
        state.animating = anim;
    }
};

var R = null;

export const actions = {
    loadSingle() {
        state = initialState();
        R = Requests(true);
        Promise.all([loadImagesPromise, R.dataPromise]).then(result => {
            var images = result[0];
            var data = result[1];

            state.imageShapes = {
                plains: images.plains,
                forrests: images.forrests
            };
            sessionStorage.setItem('singlebattleid', data.id);
            mutations.loadData(data);
        });
    },
    loadDuel() {
        state = initialState();
        R = Requests(false);
        Promise.all([loadImagesPromise, R.dataPromise]).then(result => {
            var images = result[0];
            var data = result[1];

            state.imageShapes = {
                plains: images.plains,
                forrests: images.forrests
            };
            sessionStorage.setItem('battleid', data.id);
            mutations.loadData(data);
        });        
    },
    setSize(width, height) {
        mutations.setSize(width, height);
    },
    setSelectedHex(hex) {
        var action = state.grid.getHexAction(hex);;
        if (action) {
            action();
        }
    },
    unitMoving(unit, x, y) {
        R.requestMove(state.battleId, unit.id, x, y);
    },
    unitTurning(unit, x, y) {
        R.requestTurn(state.battleId, unit.id, x, y);
    },
    unitAttacking(unit, x, y) {
        R.requestAttack(state.battleId, unit.id, x, y);
    },
    animateUnit(unit, to) {
        var animationPath = getters.grid().getPathBetween(
            getters.grid().getHexAt(unit.pos.x, unit.pos.y),
            getters.grid().getHexAt(to.x, to.y)
        );
        mutations.setPendingAnimations(unit, animationPath);
        mutations.setAnimating(true);
    },
    updateGrid() {
        function restoreUnit(upd) {
            if (!upd) { return; }
            var unit = getters.unit(upd.id);
            Object.assign(unit, upd);
        }
        if (getters.update()){
            restoreUnit(getters.update().currUnit);
            restoreUnit(getters.update().targetUnit);
            restoreUnit(getters.update().nextUnit);
        }
        mutations.setUnitHexes();
        var nextUnit = getters.nextUnit();
        mutations.setCurrentUnit(nextUnit);
    }
}