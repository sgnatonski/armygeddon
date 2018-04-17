function createHighlightLayer(center){
    var layer = new Konva.Layer({
        hitGraphEnabled : false
    });
    var overNode = null;

    layer.highlightNode = (hex) => {
        if (overNode){
            overNode.remove();
            overNode.destroy();
        }
        if (hex){
            var node = createHexVisual();
            node.position({
                x: center.x + hex.center.x,
                y: center.y + hex.center.y
            });
            node.setFill('#ffffff');
            node.setListening(false);
            node.opacity(0.2);
            layer.add(node);
            overNode = node;
        }
        layer.draw();
    };

    function highlightMoveRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual();
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });node.setFill('#ffffff');
                node.setListening(false);
                node.opacity(0.2);
                layer.add(node);
            }
        }
    };

    function highlightTurnRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual();
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });node.setFill('#ffad33');
                node.setListening(false);
                node.opacity(0.2);
                layer.add(node);
            }
        }
    };

    function highlightAttackRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i]);
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });node.setFill('#DD1111');
                node.opacity(0.5);
                node.setListening(false);
                layer.add(node);
            }
        }
    };

    layer.highlightRange = (hexes, highlightType) => {
        switch(highlightType){
            case "moving":
                highlightMoveRange(hexes, center);
                break;
            case "turning":
                highlightTurnRange(hexes, center);
                break;
            case "attacking":
                highlightAttackRange(hexes, center);
                break;
            default:
                layer.destroyChildren();
        }
        if (overNode){
            layer.add(overNode);
        }
        layer.draw();
    };

    

    return layer;
}