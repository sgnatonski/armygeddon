function createEffectLayer(center) {
    var layer = new Konva.FastLayer();

    function getMoveLinePoints(path) {
        var linepoints = path.map(h => h.center).reduce((acc, curr) => acc.concat([center.x + curr.x, center.y + curr.y]), []);
        return linepoints;
    }

    layer.drawPath = (path) => {
        var moveLines = layer.find('.move_line');
        moveLines.each(line => {
            line.remove();
            line.destroy();
        });

        var linepoints = getMoveLinePoints(path, center);
        if (linepoints && linepoints.length) {
            var moveLine = createMoveLineVisual(linepoints);
            layer.add(moveLine);
        }
        layer.draw();
    };

    var overNodes = [];

    layer.highlightNode = (hexes) => {
        if (overNodes.length) {
            for (var i = 0; i < overNodes.length; i++) {
                overNodes[i].remove();
                overNodes[i].destroy();
            }
            overNodes = [];
        }
        if (hexes) {
            for (var i = 0; i < hexes.length; i++) {
                var node = createHexVisual();
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });
                node.setFill('#ffffff');
                node.setListening(false);
                node.opacity(0.4);
                layer.add(node);
                overNodes.push(node);
            }
        }
        layer.draw();
    };

    function highlightMoveRange(hexes) {
        layer.destroyChildren();
        if (hexes) {
            for (var i = 0; i < hexes.length; i++) {
                var node = createHexVisual();
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });
                node.setFill('#ffffff');
                node.setListening(false);
                node.opacity(0.2);
                layer.add(node);
            }
        }
    };

    function highlightTurnRange(hexes) {
        layer.destroyChildren();
        if (hexes) {
            for (var i = 0; i < hexes.length; i++) {
                var node = createHexVisual();
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });
                node.setFill('#ffad33');
                node.setListening(false);
                node.opacity(0.2);
                layer.add(node);
            }
        }
    };

    function highlightAttackRange(hexes) {
        layer.destroyChildren();
        if (hexes) {
            for (var i = 0; i < hexes.length; i++) {
                var node = createHexVisual(hexes[i]);
                node.position({
                    x: center.x + hexes[i].center.x,
                    y: center.y + hexes[i].center.y
                });
                node.setFill('#DD1111');
                node.opacity(0.5);
                node.setListening(false);
                layer.add(node);
            }
        }
    };

    layer.highlightRange = (hexes, highlightType) => {
        switch (highlightType) {
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
        if (overNodes.length) {
            for (var i = 0; i < overNodes.length; i++) {
                layer.add(overNodes[i]);
            }
        }
        layer.draw();
    };

    return layer;
}