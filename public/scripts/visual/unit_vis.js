function createUnitVisual(unit, center, hexCenter, color){
  var unitBack = new Konva.Path({
    data: 'M 316 308 c -11 0 -22 -7 -26 -17 l -2 -5 l 45 -7 a 6 6 0 0 0 5 -7 c -6 -37 -7 -76 -3 -113 l 1 -12 a 107 107 0 0 0 -74 -114 c -13 -4 -23 -15 -26 -29 c 0 -2 -2 -4 -5 -4 a 6 6 0 0 0 -5 5 c -3 13 -13 24 -26 28 a 106 106 0 0 0 -74 114 l 1 12 a 415 415 0 0 1 -2 117 l 4 3 l 48 7 l -2 5 c -5 10 -15 17 -27 17 h -2 c -32 0 -58 26 -58 58 v 91 c 0 3 2 5 5 5 h 276 c 3 0 5 -2 5 -5 v -91 c 0 -32 -26 -58 -58 -58 z',
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
    data: 'M316 308c-11 0-22-7-26-17l-2-5 45-7a6 6 0 0 0 5-7c-6-37-7-76-3-113l1-12a107 107 0 0 0-74-114c-13-4-23-15-26-29 0-2-2-4-5-4a6 6 0 0 0-5 5c-3 13-13 24-26 28a106 106 0 0 0-74 114l1 12a415 415 0 0 1-2 117l4 3 48 7-2 5c-5 10-15 17-27 17h-2c-32 0-58 26-58 58v91c0 3 2 5 5 5h276c3 0 5-2 5-5v-91c0-32-26-58-58-58zm47 58v59a61 61 0 0 1-70-60c0-18 8-35 22-46h1c26 0 47 21 47 47zm-132-63c-14 0-27-5-37-14l17 3a5 5 0 0 0 7-7l-2-10a66 66 0 0 0 30 0l-1 10a6 6 0 0 0 6 7l17-3c-10 9-23 14-37 14zm18-40a55 55 0 0 1-35 0l-14-75c-1-3-3-4-6-4h-16a19 19 0 0 1-20-21c0-10 9-19 20-19h106a19 19 0 0 1 20 20c0 11-9 20-20 20h-16c-3 0-5 1-6 4l-13 75zM138 157l-1-11a96 96 0 0 1 66-103c9-2 17-8 23-14v86a6 6 0 0 0 11 0V29c5 6 13 12 22 14a95 95 0 0 1 66 103l-1 11c-4 37-3 75 2 112l-69 11 15-85h12c17 0 31-14 31-30a30 30 0 0 0-31-32H178c-16 0-30 14-31 30a30 30 0 0 0 31 32h12l15 85-69-11c6-37 6-75 2-112zm8 162h1c14 11 22 28 22 46a61 61 0 0 1-70 60v-59c0-26 21-47 47-47zM99 436a72 72 0 0 0 81-71c0-18-7-35-19-48 10-4 19-11 24-22 11 11 25 18 40 19v137H99v-15zm137 15V314c17-1 32-9 43-21l1 2c4 10 12 17 22 21a72 72 0 0 0 62 120v15H235z',
    fill: '#000000',
    scale: {
      x: 0.08,
      y: 0.08
    },
    offsetY: 60
  });
  var healthGroup = new Konva.Group();
  var healthStatus = new Konva.Rect({
    x: 0,
    y: 0,
    width: 3,
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
      context.rect(0, 30 - off, 3, off);
      context.closePath();
      // Konva specific method
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
  group.add(healthGroup);
  return group;
}
function createDeadUnitVisual(unit, center, hexCenter){
  var unitBack = new Konva.Path({
    data: 'M 316 308 c -11 0 -22 -7 -26 -17 l -2 -5 l 45 -7 a 6 6 0 0 0 5 -7 c -6 -37 -7 -76 -3 -113 l 1 -12 a 107 107 0 0 0 -74 -114 c -13 -4 -23 -15 -26 -29 c 0 -2 -2 -4 -5 -4 a 6 6 0 0 0 -5 5 c -3 13 -13 24 -26 28 a 106 106 0 0 0 -74 114 l 1 12 a 415 415 0 0 1 -2 117 l 4 3 l 48 7 l -2 5 c -5 10 -15 17 -27 17 h -2 c -32 0 -58 26 -58 58 v 91 c 0 3 2 5 5 5 h 276 c 3 0 5 -2 5 -5 v -91 c 0 -32 -26 -58 -58 -58 z',
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