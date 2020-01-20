function cullView(container, stage, layer) {
  var c = layer.children;
  var boundingX = (-1 * (stage.getAbsolutePosition().x)) - layer.getX();
  var boundingY = (-1 * (stage.getAbsolutePosition().y)) - layer.getY();
  var boundingWidth = container.width;
  var boundingHeight = container.height;
  var x = 0;
  var y = 0;
  for (var i = 0; i < c.length; i++) {
    x = c[i].getX();
    y = c[i].getY();
    if (((x > boundingX) && (x < (boundingX + boundingWidth))) && ((y > boundingY) && (y < (boundingY + boundingHeight)))) {
      if (!c[i].visible()) {
        c[i].show();
      }
    } else {
      c[i].hide();
    }
  }
}