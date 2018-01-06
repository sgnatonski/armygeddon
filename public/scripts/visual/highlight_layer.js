function createHighlightLayer(center){
    var layer = new Konva.Layer();
    var overNode = null;

    layer.highlightNode = (hex) => {
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

    function highlightMoveRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i], center);
                node.setFill('#39ac39');
                node.setListening(false);
                layer.add(node);
            }
        }
    };

    function highlightAttackRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i], center);
                node.setFill('#DD1111');
                node.opacity(0.5);
                node.setListening(false);
                layer.add(node);
            }
        }
    };

    layer.highlightRange = (hexes, highlightType) => {
        switch(highlightType){
            case "move":
                highlightMoveRange(hexes, center);
                break;
            case "attack":
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