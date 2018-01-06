function getUnitMoveAnim(layer, steps, node, center){
  return new Promise(function(resolve,reject){
    if (steps.length <= 1){
      resolve();
    }
    else{
      var currStep = steps.shift();
      var anim = new Konva.Animation(function(frame) {
          var progress = frame.time / 400;
          var sourceY = center.y + currStep.center.y;
          var targetY = center.y + steps[0].center.y;
          var diffY = targetY - sourceY;
          var calcY = sourceY + diffY * progress;
          node.setY(calcY - 28);
          var sourceX = center.x + currStep.center.x;
          var targetX = center.x + steps[0].center.x;
          var diffX = targetX - sourceX;
          var calcX = sourceX + diffX * progress;
          node.setX(calcX - 23);
          if ((diffX > 0 && calcX >= targetX) || (diffX < 0 && calcX <= targetX) ||
            (diffY > 0 && calcY >= targetY) || (diffY < 0 && calcY <= targetY)){
              currStep = steps.shift();
            frame.time = 0; // ????????
            if (!steps.length){
              anim.stop();
              node.setY(targetY - 28);
              node.setX(targetX - 23);
              resolve();
            }
          }
        }, layer);
      anim.start();
    }
  });
}