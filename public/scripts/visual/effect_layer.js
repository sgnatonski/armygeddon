function createEffectLayer(stage){
    var layer = new Konva.Layer();

    function getMoveLinePoints (grid, fromHex, toHex, center) {
        if (!fromHex || !fromHex.unit){
          return [];
        }
        var path = grid.getPathInRange(fromHex, toHex, fromHex.unit.mobility);
        var linepoints = path.map(h => h.center).reduce((acc, curr) => acc.concat([center.x + curr.x, center.y + curr.y]), []);
        return linepoints;
      }

    layer.drawPath = (grid, fromHex, toHex, center) => {
        var moveLines = layer.find('.move_line');
        moveLines.each(line => {          
          line.remove();
          line.destroy();
        });
  
        var linepoints = getMoveLinePoints(grid, fromHex, toHex, center);
        if (linepoints && linepoints.length){
          var moveLine = createMoveLineVisual(linepoints);  
          layer.add(moveLine);
        }
        layer.draw();
    };

    return layer;
}