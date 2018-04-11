function createUnitVisual(unit, center, hexCenter, color){
  var unitBack = new Konva.Path({
    data: getShape('unitBack'),
    fill: color,
    scale: {
      x: 0.08,
      y: 0.08
    },
    offsetY: 60,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {x : 40, y : 20},
    shadowOpacity: 0.5
  });
  var unitPath = new Konva.Path({
    data: getShape('unitPath'),
    fill: '#000000',
    scale: {
      x: 0.08,
      y: 0.08
    },
    offsetY: 60
  });
  var unitType = new Konva.Group({
    offset: {
      x: -18,
      y: -17
    }
  });
  unitType.add(new Konva.Circle({
    radius: 10,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    offset: {
      x: -8,
      y: -8
    },
    opacity: 0.7
  }));
  switch(unit.type){
    case 'inf':
      unitType.add(new Konva.Path({
        data: getShape('inf1'),
        fill: '#000000',
        scale: {
          x: 0.035,
          y: 0.035
        }
      }));
      unitType.add(new Konva.Path({
        data: getShape('inf2'),
        fill: '#222222',
        scale: {
          x: 0.035,
          y: 0.035
        }
      }));
      break;
    case 'arch': 
      unitType.add(new Konva.Path({
        data: getShape('arch'),
        fill: '#000000',
        scale: {
          x: 0.04,
          y: 0.04
        },
        offset: {
          x: -80,
          y: -80
        }
      }));
      break;
    case 'cav':
      unitType.add(new Konva.Path({
        data: getShape('cav1'),
        fill: '#222222',
        scale: {
          x: 0.2,
          y: 0.2
        }
      }));
      unitType.add(new Konva.Path({
        data: getShape('cav2'),
        fill: '#222222',
        scale: {
          x: 0.2,
          y: 0.2
        }
      }));
      break;
  }
  var healthGroup = new Konva.Group();
  var healthStatus = new Konva.Rect({
    width: 2,
    height: 30,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    strokeHitEnabled: false
  });
  var healthStatusBar = new Konva.Shape({
    sceneFunc: function(context) {
      var fillValue = unit.endurance / unit.lifetime.endurance;
      if (fillValue < 0){
        fillValue = 0;
      }
      var off = Math.floor(30 * fillValue);
      context.beginPath();
      context.rect(0, 30 - off, 2, off);
      context.closePath();
      context.fillStrokeShape(this);
    },
    fill: 'green',
    stroke: 'black',
    strokeWidth: 0.5,
    strokeHitEnabled: false
  });
  healthGroup.add(healthStatus);
  healthGroup.add(healthStatusBar);
  var direction = new Konva.Shape({
    x: 19,
    y: 15,
    fill: '#ffff66',
    opacity: 0.35,
    sceneFunc: function(context){
      if (!unit.armor){
        return;
      }
      var x = 0;
      if (unit.directions.length > 1){
        x = 1;
      }
      var rotation = -30 + (unit.directions[0] - 1) * 60 - (x * 60);
      var angle = 60 * unit.directions.length;
      context.rotate(Konva.getAngle(rotation));
      context.beginPath();
      context.arc(0, 0, 32, 0, Konva.getAngle(angle), false);
      context.lineTo(0, 0);
      context.closePath();
      context.fillStrokeShape(this);
    }
  });
  var group = new Konva.Group({
    listening: false,
    x: center.x + hexCenter.x,
    y: center.y + hexCenter.y,
    offset: {
      x: 19,
      y: 15
    }
  });
  group.add(direction);
  group.add(unitBack);
  group.add(unitPath);
  group.add(unitType);
  group.add(healthGroup);
  return group;
}
function createDeadUnitVisual(unit, center, hexCenter){
  var unitBack = new Konva.Path({
    data: getShape('unitBack'),
    fill: '#777777',
    scale: {
      x: 0.08,
      y: 0.08
    },
    offsetY: 60,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {x : 40, y : 20},
    shadowOpacity: 0.5
  });
  var group = new Konva.Group({
    listening: false,
    x: center.x + hexCenter.x,
    y: center.y + hexCenter.y,
    offset: {
      x: 19,
      y: 15
    }
  });
  group.add(unitBack);
  return group;
}