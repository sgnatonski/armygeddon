function cullView(container, stage, layer) {
  var c = layer.children;
  var cullMargin = 50;
  var boundingX = (-1 * (stage.getAbsolutePosition().x)) - layer.getX() - cullMargin;
  var boundingY = (-1 * (stage.getAbsolutePosition().y)) - layer.getY() - cullMargin;
  var boundingWidth = container.width + cullMargin * 2;
  var boundingHeight = container.height + cullMargin * 2;
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