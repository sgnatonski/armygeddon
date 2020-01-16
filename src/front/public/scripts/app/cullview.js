function cullView(container, stage, layer) {
    var boundingX = (-1 * (stage.x())) - (container.clientWidth / 2);
    var boundingY = (-1 * (stage.y())) - (container.clientHeight / 2);
    var boundingWidth = (2 * container.clientWidth);
    var boundingHeight = (2 * container.clientHeight);
    var x = 0;
    var y = 0;
    var c = layer.children;
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