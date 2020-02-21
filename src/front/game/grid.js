import BHex from "bhex";

// TODO: get rid of getters & actions references
function initGrid(sceneSize, terrain, getters) {
  function getMoveCost(sourceHex, targetHex, range) {
    var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y));
    var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y)) || [];
    var cost = path.map(x => x.cost).reduce((a, b) => a + b, 0);
    return cost;
  }

  function getPathInRange(sourceHex, targetHex) {
    var unit = getters.unitAt(sourceHex.x, sourceHex.y);
    if (!unit) {
      var gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
      var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));

      return [sourceHex].concat(path);
    }
    else {
      var range;
      var ignoreInertia;
      var unitState = getters.unitState(unit);
      var gridPath = [];

      switch (unitState) {
        case 'moving':
          range = unit.mobility;
          gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
          if (gridPath.length && unit.agility) {
            var t = getTurnCoords();
            var x = t[unit.directions[0] - 1];
            var posStart = new BHex.Axial(sourceHex.x, sourceHex.y);
            var posEnd = new BHex.Axial(unit.pos.x + (x.x * (unit.mobility - 1)), unit.pos.y + (x.y * (unit.mobility - 1)));
            var gridRange = grid.getConeRange(posStart, posEnd, unit.mobility);
            gridPath = gridPath.filter(x => gridRange.some(g => g.x == x.x && g.y == x.y));
          }
          break;
        case 'attacking':
          range = unit.range;
          ignoreInertia = true;
          gridPath = grid.findPath(new BHex.Axial(sourceHex.x, sourceHex.y), new BHex.Axial(targetHex.x, targetHex.y), ignoreInertia);
          break;
      }
      var path = gridPath.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));

      var inRange = path.reduce((acc, curr) => {
        var accCost = acc.map(x => x.cost).reduce((a, b) => a + b, -sourceHex.cost);
        if (ignoreInertia || accCost + curr.cost <= range) {
          acc.push(curr);
        }
        return acc;
      }, [sourceHex]);
      return inRange;
    }
  }

  function getHexAction(hex) {
    var unit = getters.selectedHex() && hex ? getters.unitAt(getters.selectedHex().x, getters.selectedHex().y) : null;

    var unitState = getters.unitState(unit);
    switch (unitState) {
      case 'moving':
        var path = getPathInRange(getters.selectedHex(), hex);
        var lastStep = path[path.length - 1];
        if (lastStep.x == hex.x && lastStep.y == hex.y) {
          return unitState;
        }
        break;
      case 'turning':
        return unitState;
      case 'attacking':
        var path = getPathInRange(getters.selectedHex(), hex, unit.range, true);
        var lastStep = path[path.length - 1];
        if (lastStep.x == hex.x && lastStep.y == hex.y) {
          return unitState;
        }
        break;
    }
  };

  function getTurnCoords() {
    return [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
    ];
  }

  function getTurnAngle(unit) {
    var turns = getTurnCoords();

    var dir = unit.directions[0];

    var t = [turns[dir - 1]];
    for (var i = 1; i <= unit.agility; i++) {
      var n1 = dir - 1 - i;
      if (n1 < 0) {
        n1 = turns.length + n1;
      }
      var n2 = dir - 1 + i;
      if (n2 > turns.length - 1) {
        n2 = n2 - turns.length;
      }
      t.push(turns[n1]);
      t.push(turns[n2]);
    }
    return t;
  }

  function getSelectedHexRange() {
    var unit = getters.selectedHex() ? getters.unitAt(getters.selectedHex().x, getters.selectedHex().y) : null;
    if (!unit) {
      return [];
    }

    var state = getters.unitState(unit);
    var gridRange = [];
    if (state == 'moving') {
      if (!unit.agility) {
        gridRange = grid.getRange(new BHex.Axial(getters.selectedHex().x, getters.selectedHex().y), unit.mobility);
      }
      else {
        var t = getTurnCoords();
        var x = t[unit.directions[0] - 1];
        var posStart = new BHex.Axial(getters.selectedHex().x, getters.selectedHex().y);
        var posEnd = new BHex.Axial(unit.pos.x + (x.x * (unit.mobility - 1)), unit.pos.y + (x.y * (unit.mobility - 1)));
        gridRange = grid.getConeRange(posStart, posEnd, unit.mobility);
      }
    }
    else if (state == 'turning') {
      gridRange = getTurnAngle(unit).map(a => grid.getHexAt(new BHex.Axial(unit.pos.x + a.x, unit.pos.y + a.y)));
    }
    else {
      gridRange = grid.getRange(new BHex.Axial(getters.selectedHex().x, getters.selectedHex().y), unit.range, true);
    }

    return gridRange.filter(h => terrain.find(t => t.x == h.x && t.y == h.y));
  };

  function getSelectedHexState() {
    return getters.unitState(getters.selectedHex() ? getters.unitAt(getters.selectedHex().x, getters.selectedHex().y) : null);
  };

  function initDrawing(center) {
    var sideWidth = 30;
    var options = new BHex.Drawing.Options(sideWidth, BHex.Drawing.Static.Orientation.PointyTop, new BHex.Drawing.Point(center.x, center.y));
    BHex.Drawing.Drawing(grid, options);

    var minX = 999999999;
    var minY = 999999999;
    var maxX = 0;
    var maxY = 0;
    getHexes().sort((a, b) => {
      if (a.center.x < minX) minX = a.center.x;
      if (a.center.x > maxX) maxX = a.center.x;
      if (a.center.y < minY) minY = a.center.y;
      if (a.center.y > maxY) maxY = a.center.y;

      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;

      if (a.x > b.x) return 1;
      if (a.x < b.x) return -1;

      return 0;
    });

    return { minX, minY, maxX, maxY };
  };

  function getHexes() {
    return terrain.map(t => grid.hexes.find(h => t.x == h.x && t.y == h.y));
  };

  var grid = new BHex.Grid(sceneSize);

  terrain.forEach(terrain => {
    grid.getHexAt(new BHex.Axial(terrain.x, terrain.y)).cost = terrain.cost;
  });

  return {
    getHexes: getHexes,
    getHexAt: (x, y) => grid.getHexAt(new BHex.Axial(x, y)),
    getHexAction: getHexAction,
    getSelectedHexRange: getSelectedHexRange,
    getSelectedHexState: getSelectedHexState,
    getSelectedHexMoveCost: (x, y) => getters.selectedHex() ? getMoveCost(getters.selectedHex(), grid.getHexAt(new BHex.Axial(x, y)), getters.unitAt(getters.selectedHex().x, getters.selectedHex().y)) : null,
    getPathBetween: getPathInRange,
    initDrawing: initDrawing,
    setBlocked: (units) => {   
      var set = new Set(units.map(u => `${u.pos.x}:${u.pos.y}`));
      getHexes().forEach(h => {
        h.blocked = set.has(`${h.x}:${h.y}`);
      });

    }
  }
}

export default initGrid;