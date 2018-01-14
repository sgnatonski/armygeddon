function createUnitLayer(center, animator){
    var layer = new Konva.Layer();

    var armyColors = [
        '#00cc00',
        '#c80b04'
    ];
    var colId = 0;
    var armyColorSelection = {};
    var unitNodes = [];

    function addUnitNode(unit, hexCenter, armyId) {
        var unitSceneNode = unit.endurance > 0
            ? createUnitVisual(unit, center, hexCenter, armyColorSelection[armyId])
            : createDeadUnitVisual(unit, center, hexCenter);
        animator.registerAnimation(unit.id, unitSceneNode, center);
        unitNodes.push({ 
            node: unitSceneNode, 
            unit: unit, 
            armyId: armyId,
            hexCenter: hexCenter 
        });
        return unitSceneNode;
    }

    return {
        node: layer,
        addUnit: (unit, hexCenter, armyId) => {
            if (!armyColorSelection[armyId]){
                armyColorSelection[armyId] = armyColors[colId];
                colId++;
            }
            var unitNode = addUnitNode(unit, hexCenter, armyId);
            layer.add(unitNode);
        },
        refresh: (units) =>{
            layer.destroyChildren();
            var nodes = unitNodes.slice();
            unitNodes = [];
            nodes.forEach(un => {
                var unitNode = addUnitNode(un.unit, un.hexCenter, un.armyId);
                unitNode.setX(un.node.getX());
                unitNode.setY(un.node.getY());
                layer.add(unitNode);
            });
            layer.draw();
        }
    };
}