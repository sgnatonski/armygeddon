function createEffectLayer(center) {
  var layer = new Konva.Layer({
    hitGraphEnabled: false
  });

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

  return layer;
}