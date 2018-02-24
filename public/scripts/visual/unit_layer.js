function createUnitLayer(center, grid, animator){
    var layer = new Konva.Layer();

    var armyColors = [
        '#00cc00',
        '#c80b04'
    ];
    var unitNodes = [];

    grid.getUnits().forEach(unit => {
        var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
        addUnit(unit, hex.center);
    });

    function addUnitNode(unit, hexCenter, isPlayerArmy) {
        var unitSceneNode = unit.endurance > 0
            ? createUnitVisual(unit, center, hexCenter, isPlayerArmy ? armyColors[0] : armyColors[1])
            : createDeadUnitVisual(unit, center, hexCenter);
        animator.registerAnimation(unit.id, unitSceneNode, center);
        unitNodes.push({ 
            node: unitSceneNode, 
            unit: unit, 
            isPlayerArmy: isPlayerArmy,
            hexCenter: hexCenter 
        });
        return unitSceneNode;
    }

    function addUnit(unit, hexCenter) {
        var unitNode = addUnitNode(unit, hexCenter, grid.isPlayerArmy(unit.id, true));
        layer.add(unitNode);
    }

    return {
        node: layer,
        refresh: () =>{
            layer.destroyChildren();
            var nodes = unitNodes.slice();
            unitNodes = [];
            nodes.forEach(un => {
                var unitNode = addUnitNode(un.unit, un.hexCenter, un.isPlayerArmy);
                unitNode.setX(un.node.getX());
                unitNode.setY(un.node.getY());
                layer.add(unitNode);
            });
            layer.draw();
        }
    };
}