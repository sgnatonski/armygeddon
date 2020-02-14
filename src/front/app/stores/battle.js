import Vue from "vue";
import loadImage from "image-promise";
import fetch from "../../game/fetch";
import eventBus from "../eventBus";
import Army from "../../game/army";
import Grid from "../../game/grid";
import { requestMove, requestTurn, requestAttack } from "../../game/requests/http_request";

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

const state = Vue.observable({
    center: { x: 0, y: 0 },
    width: 0,
    height: 0,
    boundingBox: null,
    sceneSize: '',
    grid: null,
    imageShapes: [],
    animating: false,
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
        if (getters.currentUnit() && getters.isPlayerArmy(getters.currentUnit().id)) {
            return state.grid.getSelectedHexRange();
            // disabled of performance reasons
            //this.path = this.grid.getPathBetween(selHex, hex);
        }
        return [];
    },
    currentUnitState: () => {
        if (getters.currentUnit() && getters.isPlayerArmy(getters.currentUnit().id)) {
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
    loadData(data, single) {
        var armies = Object.keys(data.armies).map(key => data.armies[key]);
        sessionStorage.setItem(single ? 'singlebattleid' : 'battleid', data.id);
        state.battleState = 'created';
        state.battleId = data.id;
        state.selfArmy = data.selfArmy;
        state.terrain = data.terrain;
        state.sceneSize = data.sceneSize;
        state.unitQueue = data.turns[data.turns.length - 1].readyUnits;
        state.firstArmy = new Army(armies[0], data.unitTypes);
        //var bsTxt1 = this.getBattleStateText();
        //setTimeout(() => eventBus.publish('battlestate', bsTxt1), 0);
        if (armies.length == 2) {
            state.secondArmy = new Army(armies[1], data.unitTypes);
            state.battleState = 'ready';
            state.winningArmy = data.winningArmy;
            if (state.winningArmy) {
                return mutations.end(data);
            }
            //var bsTxt2 = this.getBattleStateText();
            setTimeout(() => eventBus.publish('battlestarted'), 0);
            //setTimeout(() => eventBus.publish('battlestate', bsTxt2), 0);
            var nextUnitArmy = getters.army(getters.nextUnit().id);
            setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters.nextUnit().type} unit is next to act`), 0);
        }
        else {
            setTimeout(() => eventBus.publish('battlewaiting'), 0);
        }
        state.grid = Grid(state.sceneSize, state.terrain, getters, actions);

        var { minX, minY, maxX, maxY } = state.grid.initDrawing(state.center);
        state.boundingBox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        var y = (Math.abs(state.boundingBox.minY) + Math.abs(state.boundingBox.maxY) + 160) / 2;
        mutations.setCenter(state.center.x, y);

        mutations.setUnitHexes();

        state.grid.hexSelected();
        var selHex = state.grid.getSelectedHex();
        if (selHex) {
            state.selectedHex = selHex;
            var unit = getters.unitAt(selHex.x, selHex.y);
            state.currentUnit = unit;
        }

        eventBus.on('update', mutations.update);
        eventBus.on('end', mutations.end);
    },
    update(data) {
        state.update = data;
        state.battleState = 'started';
        state.unitQueue = data.unitQueue;
        state.targetUnit = data.currUnit.pos;

        var delta = {
            source: state.currentUnit.pos,
            target: data.currUnit.pos
        };
        
        setTimeout(() => eventBus.publish('battleupdated', { delta: delta, data: data }), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);

        actions.animateUnit(state.currentUnit, delta.source, delta.target);
        
        state.currentUnit = data.nextUnit;
    },
    end(data) {
        state.battleState = 'finished';
        mutations.setUnitHexes();
        //setTimeout(() => eventBus.publish('battleended', this.getBattleSummary(data)), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
    },
    setSize(width, height) {
        state.width = width;
        state.height = height;
        mutations.setCenter(width / 2, height / 2);
    },
    setCenter(x, y) {
        state.center = { x: x, y: y };
    },
    setSelectedHex(hex) {
        state.selectedHex = hex;
        return state.grid.hexSelected(hex);
    },
    setUnitHexes() {
        state.unitHexes = getters.units().map(u => getters.grid().getHexAt(u.pos.x, u.pos.y));
        getters.grid().setBlocked(state.unitHexes);
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

export const actions = {
    load() {
        var battleid = sessionStorage.getItem('singlebattleid');
        var url = `/singlebattle/join/${battleid ? battleid : ''}`;
        Promise.all([loadImages(), fetch().post(url)]).then(result => {
            var images = result[0];
            var data = result[1];

            state.imageShapes = {
                plains: images.plains,
                forrests: images.forrests
            };
            mutations.loadData(data, true);
        });
    },
    setSize(width, height) {
        mutations.setSize(width, height);
    },
    setCenter(x, y) {
        mutations.setCenter(x, y);
    },
    setSelectedHex(hex) {
        var action = mutations.setSelectedHex(hex);
        if (action){
            action();
        }
    },
    unitMoving(unit, x, y) {
        requestMove(state.battleId, unit.id, x, y);
    },
    unitTurning(unit, x, y) {
        requestTurn(state.battleId, unit.id, x, y);
    },
    unitAttacking(unit, x, y) {
        requestAttack(state.battleId, unit.id, x, y);
    },
    animateUnit(unit, from, to) {
        var animationPath = getters.grid().getPathBetween(
            getters.grid().getHexAt(from.x, from.y),
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
        restoreUnit(getters.update().currUnit);
        restoreUnit(getters.update().targetUnit);
        restoreUnit(getters.update().nextUnit);
        mutations.setUnitHexes();
        var nextUnit = getters.nextUnit();
        var nextHex = getters.grid().getHexAt(nextUnit.pos.x, nextUnit.pos.y);
        mutations.setSelectedHex(nextHex);
        var nextUnitArmy = getters.army(nextUnit.id);
        setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters.nextUnit().type} unit is next to act`), 0);
    }
}