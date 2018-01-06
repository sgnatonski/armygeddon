function createHighlightLayer(stage){
    var layer = new Konva.Layer();
    var overNode = null;

    layer.highlightNode = (hex, center) => {
        if (overNode){
            overNode.remove();
            overNode.destroy();
        }
        if (hex){
            var node = createHexVisual(hex, center);
            node.setFill('#3399ff');
            node.setListening(false);
            layer.add(node);
            overNode = node;
        }
        layer.draw();
    };

    layer.highlightRange = (hexes, highlightType, center) => {
        switch(highlightType){
            case "move":
                layer.highlightMoveRange(hexes, center);
                break;
            case "attack":
                layer.highlightAttackRange(hexes, center);
                break;
            default:
                layer.destroyChildren();
        }
        layer.draw();
    };

    layer.highlightMoveRange = (hexes, center) => {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i], center);
                node.setFill('#39ac39');
                node.setListening(false);
                layer.add(node);
            }
        }
        if (overNode){
            layer.add(overNode);
        }
    };

    layer.highlightAttackRange = (hexes, center) => {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i], center);
                node.setFill('#775353');
                node.setListening(false);
                layer.add(node);
            }
        }
        if (overNode){
            layer.add(overNode);
        }
    };

    return layer;
}