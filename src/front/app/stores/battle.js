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
    currentUnit: null
});

export const getters = {
    animating: () => state.animating,
    pendingAnimations: () => state.pendingAnimations,
    center: () => state.center,
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
    targetUnit: () => state.targetUnit,
    nextUnit: () => getters.units().find(u => u.id == state.unitQueue[0]),
    nextUnit: () => getters.units().find(u => u.id == state.unitQueue[0]),
    nextPlayer: () => actions.getArmy(nextUnit).playerName,
    winningArmy: () => state.winningArmy,
    units: () => {
        if (!state.firstArmy) {
            return null;
        }
        if (!state.secondArmy) {
            return state.firstArmy.getArmy();
        }
        return state.firstArmy.getArmy().concat(state.secondArmy.getArmy());
    },
    unitHexes: () => state.unitHexes
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
            var nextUnitArmy = actions.getArmy(getters.nextUnit().id);
            setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters.nextUnit().type} unit is next to act`), 0);
        }
        else {
            setTimeout(() => eventBus.publish('battlewaiting'), 0);
        }
        state.grid = Grid(state.sceneSize, state.terrain, state.firstArmy.getArmy().concat(state.secondArmy.getArmy()), getters, actions);

        var { minX, minY, maxX, maxY } = state.grid.initDrawing(state.center);
        state.boundingBox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        var y = (Math.abs(state.boundingBox.minY) + Math.abs(state.boundingBox.maxY) + 160) / 2;
        mutations.setCenter(state.center.x, y);

        mutations.setUnitHexes();

        state.grid.hexSelected();
        var selHex = state.grid.getSelectedHex();
        if (selHex) {
            state.selectedHex = selHex;
            var unit = actions.getUnitAt(selHex.x, selHex.y);
            if (actions.isPlayerArmy(unit.id)) {
                state.currentUnit = unit;
                //state.unitRange = state.grid.getSelectedHexRange();
                //state.unitState = state.grid.getSelectedHexState();
            }
        }

        eventBus.on('update', mutations.update);
        eventBus.on('end', mutations.end);
    },
    update(data) {
        state.battleState = 'started';
        state.currentUnit = data.currUnit;
        
        var delta = {
            source: getters.nextUnit().pos,
            target: data.currUnit.pos
        };
        state.unitQueue = data.unitQueue;        
        state.targetUnit = delta.target;
        
        actions.animateUnit(state.currentUnit, delta.source, delta.target);

        setTimeout(() => eventBus.publish('battleupdated', { delta: delta, data: data }), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
        var nextUnit = getters.nextUnit();
        var nextUnitArmy = actions.getArmy(nextUnit.id);
        setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters.nextUnit().type} unit is next to act`), 0);
    },
    end(data) {
        state.battleState = 'finished';
        mutations.setUnitHexes();
        //setTimeout(() => eventBus.publish('battleended', this.getBattleSummary(data)), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
    },
    setCenter(x, y) {
        state.center = { x: x, y: y };
    },
    setSelectedHex(hex) {
        state.selectedHex = hex;
        state.grid.hexSelected(hex);
    },
    setUnitHexes() {
        state.unitHexes = getters.units().map(u => getters.grid().getHexAt(u.pos.x, u.pos.y));
        getters.grid().setBlocked(state.unitHexes);        
    },
    setPendingAnimations(unit, animation) {
        if (!unit || !animation){
            state.pendingAnimations = {};
        }
        else{
            state.pendingAnimations[unit.id] = animation;
            state.pendingAnimations = Object.assign({}, state.pendingAnimations);
        }
    },
    setAnimating(anim) {
        if (!anim){
            mutations.setPendingAnimations(null);
        }
        state.animating = anim;
    }
};

export const actions = {
    getArmy(unitId) {
        return state.firstArmy.getArmy().some(x => x.id == unitId)
            ? state.firstArmy
            : state.secondArmy;
    },
    getOtherArmy(unitId) {
        return state.firstArmy.getArmy().some(x => x.id == unitId)
            ? state.secondArmy
            : state.firstArmy;
    },
    getUnitAt(x, y) {
        return getters.units().find(u => u.pos.x == x && u.pos.y == y);
    },
    getUnitState(unit) {
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
        if (exactMatch) {
            return state.selfArmy === actions.getArmy(unitId).playerId;
        }

        return state.selfArmy === actions.getArmy(unitId).playerId
            || '_' + state.selfArmy === actions.getArmy(unitId).playerId
            || state.selfArmy === '_' + actions.getArmy(unitId).playerId;
    },
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
    setCenter(x, y) {
        mutations.setCenter(x, y);
    },
    setSelectedHex(hex) {
        mutations.setSelectedHex(hex);
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
        var army = actions.getArmy(getters.currentUnit().id);
        army.restoreUnit(getters.currentUnit());
        var targetUnit = getters.targetUnit();
        if (targetUnit && targetUnit.id) {
            var targetArmy = actions.getArmy(targetUnit.id);
            targetArmy.restoreUnit(targetUnit);
        }
        var nextUnit = getters.nextUnit();
        var nextUnitArmy = actions.getArmy(nextUnit.id);
        nextUnitArmy.restoreUnit(nextUnit);
        mutations.setUnitHexes();        
        var nextHex = getters.grid().getHexAt(nextUnit.pos.x, nextUnit.pos.y);
        mutations.setSelectedHex(nextHex);
    }
}