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
    battleState: '',
    battleId: '',
    selfArmy: null,
    terrain: null,
    unitQueue: [],
    firstArmy: null,
    secondArmy: null,
    nextPlayer: null,
    winningArmy: null,
    grid: null,
    selectedHex: null,
    imageShapes: []
});

export const getters = {
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
            //setTimeout(() => eventBus.publish('battlestate', `${nextPlayer} ${nextUnit.type} unit is next to act`), 0);
        }
        else {
            setTimeout(() => eventBus.publish('battlewaiting'), 0);		
        }
        state.grid = Grid(state.sceneSize, state.terrain, state.firstArmy.getArmy().concat(state.secondArmy.getArmy()), getters, actions);

        var { minX, minY, maxX, maxY } = state.grid.initDrawing(state.center);
        state.boundingBox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
        var y = (Math.abs(state.boundingBox.minY) + Math.abs(state.boundingBox.maxY) + 160) / 2;
        mutations.setCenter(state.center.x, y);

        state.grid.hexSelected();
        var selHex = state.grid.getSelectedHex();
        if (selHex) {
            state.selectedHex = selHex;
            var unit = actions.getUnitAt(selHex.x, selHex.y);
            if (actions.isPlayerArmy(unit.id)) {
                //state.unitRange = state.grid.getSelectedHexRange();
                //state.unitState = state.grid.getSelectedHexState();
            }
        }
    },
    update(data) {
        state.battleState = 'started';
        var delta = {
            source: state.nextUnit.pos,
            target: data.currUnit.pos
        };

        state.unitQueue = data.unitQueue;
        var army = actions.getArmy(data.currUnit.id);
        army.restoreUnit(data.currUnit);
        if (data.targetUnit) {
            var targetArmy = actions.getArmy(data.targetUnit.id);
            targetArmy.restoreUnit(data.targetUnit);
        }
        var nextUnitArmy = actions.getArmy(data.nextUnit.id);
        nextUnitArmy.restoreUnit(data.nextUnit);
        setTimeout(() => eventBus.publish('battleupdated', { delta: delta, data: data}), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
        setTimeout(() => eventBus.publish('battlestate', `${nextPlayer} ${nextUnit.type} unit is next to act`), 0);
    },
    end(data) {
        state.battleState = 'finished';
        //setTimeout(() => eventBus.publish('battleended', this.getBattleSummary(data)), 0);
        //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
    },
    setCenter(x, y) {
        state.center = { x: x, y: y };
    },
    setSelectedHex(hex) {
        state.selectedHex = hex;        
        state.grid.hexSelected(hex);
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
        loadImages().then(images => {
            state.imageShapes = {
                plains: images.plains,
                forrests: images.forrests
            };
            var battleid = sessionStorage.getItem('singlebattleid');
            var url = `/singlebattle/join/${battleid ? battleid : ''}`;
            return fetch().post(url);
        }).then(data => {
            mutations.loadData(data, true);
        })
    },
    setCenter(x, y) {
        mutations.setCenter(x, y);
    },
    setSelectedHex(hex) {
        mutations.setSelectedHex(hex);
    },
    unitMoving(unit, x, y, distance) {	
        requestMove(state.battleId, unit.id, x, y);
    },    
    unitTurning(unit, x, y) {
        requestTurn(state.battleId, unit.id, x, y);
    },    
    unitAttacking(unit, x, y) {
        requestAttack(state.battleId, unit.id, x, y);
    }
}