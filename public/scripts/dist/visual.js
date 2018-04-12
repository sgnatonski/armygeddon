function createEffectLayer(center){
    var layer = new Konva.Layer();

    function getMoveLinePoints (path) {
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
        if (linepoints && linepoints.length){
          var moveLine = createMoveLineVisual(linepoints);  
          layer.add(moveLine);
        }
        layer.draw();
    };

    return layer;
}
var imageShapes;

function createTerrainVisual(hex, center, images){
    if (!imageShapes){
        function createShape(img){
            return new Konva.Image({
                image: img,
                width: 70,
                height:70,
                offset: {
                    x: 35,
                    y: 35
                },
                rotation: 30
              });
        };

        imageShapes = {
            plains: images.plains.map(createShape),
            forrests: images.forrests.map(createShape)
        };
    }
    
    function getHexTerrainImage(hex, center){
        if (hex.cost < 0){
            return;
        }
        var shape;
        if (hex.cost == 1){
            var gNumber = Math.floor(Math.random() * 6);
            shape = imageShapes.plains[gNumber].clone();
        }
        else {
            var gNumber = Math.floor(Math.random() * 2);
            shape = imageShapes.forrests[gNumber].clone();
        }

        shape.x(center.x + hex.center.x);
        shape.y(center.y + hex.center.y);
        return shape;
    }

    var group = new Konva.Group();
    
    var terrain = getHexTerrainImage(hex, center);

    if(terrain){
        group.add(terrain);
    }
    group.add(createHexVisual(hex, center));
    
    return group;
}

function createHexVisual(hex, c){
    var center = c;
    function nextCoord(idx){
        return [center.x + hex.points[idx].x, center.y + hex.points[idx].y]
    }
  
    var hexShape = new Konva.Shape({
        sceneFunc: function(context) {
          context.beginPath();
          context.moveTo(...nextCoord(0));
          context.lineTo(...nextCoord(1));
          context.lineTo(...nextCoord(2));
          context.lineTo(...nextCoord(3));
          context.lineTo(...nextCoord(4));
          context.lineTo(...nextCoord(5));
          context.closePath();
          context.fillStrokeShape(this);
        },
        stroke: '#003300',
        strokeWidth: 0.7,
        strokeHitEnabled: false
    });

    return hexShape;
}

function createHexCoordVisual(hex, center){
    var simpleText = new Konva.Text({
        x: center.x + hex.center.x,
        y: center.y + hex.center.y,
        text: `${hex.x}, ${hex.y}`,
        fontSize: 10,
        fill: 'black',
        listening: false
    });
  
    simpleText.setOffset({
        x: simpleText.getWidth() / 2,
        y: simpleText.getHeight() / 2
    });
    return simpleText;
}
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
            node.setFill('#ffffff');
            node.setListening(false);
            node.opacity(0.2);
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
                node.setFill('#ffffff');
                node.setListening(false);
                node.opacity(0.2);
                layer.add(node);
            }
        }
    };

    function highlightTurnRange (hexes) {
        layer.destroyChildren();
        if (hexes){
            for (var i = 0; i < hexes.length; i++){
                var node = createHexVisual(hexes[i], center);
                node.setFill('#ffad33');
                node.setListening(false);
                node.opacity(0.2);
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
        if (overNode){
            layer.add(overNode);
        }
        layer.draw();
    };

    

    return layer;
}
function createMoveLineVisual(linepoints){
    var moveLine = new Konva.Line({
        points: linepoints,
        stroke: '#ccffff',
        shadowColor: 'black',
        strokeWidth: 10,
        lineCap: 'round',
        lineJoin: 'round',
        dash: [1, 12, 1, 15],
        tension : 0.3,
        name: 'move_line',
        listening: false,
        strokeHitEnabled: false
      });
    return moveLine;
}
function getShape(id) {
    switch (id) {
        case 'unitBack':
            return 'M 316 308 c -11 0 -22 -7 -26 -17 l -2 -5 l 45 -7 a 6 6 0 0 0 5 -7 c -6 -37 -7 -76 -3 -113 l 1 -12 a 107 107 0 0 0 -74 -114 c -13 -4 -23 -15 -26 -29 c 0 -2 -2 -4 -5 -4 a 6 6 0 0 0 -5 5 c -3 13 -13 24 -26 28 a 106 106 0 0 0 -74 114 l 1 12 a 415 415 0 0 1 -2 117 l 4 3 l 48 7 l -2 5 c -5 10 -15 17 -27 17 h -2 c -32 0 -58 26 -58 58 v 91 c 0 3 2 5 5 5 h 276 c 3 0 5 -2 5 -5 v -91 c 0 -32 -26 -58 -58 -58 z';
        case 'unitPath':
            return 'M316 308c-11 0-22-7-26-17l-2-5 45-7a6 6 0 0 0 5-7c-6-37-7-76-3-113l1-12a107 107 0 0 0-74-114c-13-4-23-15-26-29 0-2-2-4-5-4a6 6 0 0 0-5 5c-3 13-13 24-26 28a106 106 0 0 0-74 114l1 12a415 415 0 0 1-2 117l4 3 48 7-2 5c-5 10-15 17-27 17h-2c-32 0-58 26-58 58v91c0 3 2 5 5 5h276c3 0 5-2 5-5v-91c0-32-26-58-58-58zm47 58v59a61 61 0 0 1-70-60c0-18 8-35 22-46h1c26 0 47 21 47 47zm-132-63c-14 0-27-5-37-14l17 3a5 5 0 0 0 7-7l-2-10a66 66 0 0 0 30 0l-1 10a6 6 0 0 0 6 7l17-3c-10 9-23 14-37 14zm18-40a55 55 0 0 1-35 0l-14-75c-1-3-3-4-6-4h-16a19 19 0 0 1-20-21c0-10 9-19 20-19h106a19 19 0 0 1 20 20c0 11-9 20-20 20h-16c-3 0-5 1-6 4l-13 75zM138 157l-1-11a96 96 0 0 1 66-103c9-2 17-8 23-14v86a6 6 0 0 0 11 0V29c5 6 13 12 22 14a95 95 0 0 1 66 103l-1 11c-4 37-3 75 2 112l-69 11 15-85h12c17 0 31-14 31-30a30 30 0 0 0-31-32H178c-16 0-30 14-31 30a30 30 0 0 0 31 32h12l15 85-69-11c6-37 6-75 2-112zm8 162h1c14 11 22 28 22 46a61 61 0 0 1-70 60v-59c0-26 21-47 47-47zM99 436a72 72 0 0 0 81-71c0-18-7-35-19-48 10-4 19-11 24-22 11 11 25 18 40 19v137H99v-15zm137 15V314c17-1 32-9 43-21l1 2c4 10 12 17 22 21a72 72 0 0 0 62 120v15H235z';
        case 'inf1':
            return 'M237.3 60.5c-4.7 3.5-68.5 51-150.2 67.3-10.8 188.8 150 286.5 150.2 286.4 0 0 161-97.6 150.2-286.4-81.8-16.3-150.2-67.3-150.2-67.3z';
        case 'inf2':
            return 'M440.6 97.4a12.6 12.6 0 0 0-10-11.6c-99.8-20-185-82.7-185.8-83.3a12.6 12.6 0 0 0-15.2 0C226.3 5.2 146.2 65.4 44 85.9c-5.6 1.1-9.8 6-10.1 11.6-8.2 143.4 59 246.6 117 307.9a479.7 479.7 0 0 0 73 63c7 4.8 9.1 6.1 13 6.2h.5c4 0 6.3-1.5 12.4-5.7a473 473 0 0 0 65.3-54.7c37.3-37.5 67-79.4 88.3-124.3a392.4 392.4 0 0 0 37.2-192.4zm-110.4 262a442 442 0 0 1-93 87.5 442 442 0 0 1-92.8-87.5c-60-75.2-88.8-159.6-85.8-251C145 89 214.8 44 237.3 28.2c22.9 15.8 94 61.1 178.6 80.4 3 91.3-25.8 175.7-85.7 250.9z';
        case 'arch':
            return 'M301.3 246.2l-55.7-19s-2.3-1.1-3.2-2L188 170.8c-1.1-.7-.4-1.8 0-2.2L288.5 68.1c24.1-24.1 14.5-46.3-8.3-23.5-6 6-18.3 6.2-33.6 3l-10.2-2.4C200.9 37 161 27.8 101 82.1c-.3.3-1.1 1.2-2.4-.1C87 70.4 78 61 69.8 52.7c-1.8-1.9-.4-3.1-.4-3.1l4.4-4.4c5.5-5.5 4.2-12.6-2.8-15.9l-61-28C3-2 0 1.2 3.1 8.2l28 61c3.3 7 10.5 8.3 16 2.8l3.4-3.5s2-2.5 4-.5l28.4 28.4c1.5 1.3 1.3 2.4 1 2.7-56 61.2-45.6 108.2-37.2 146.3l.4 1.8c3.7 16.7 2.2 29.9-5.8 37.9-17.3 17.3-11.2 41.4 26.4 3.8l103-103c.3-.2.9-.7 2 .3l54.6 54.6c.7.7 1.7 2.9 1.7 2.9l19 55.8c2.6 7.4 7.1 7.5 10.2.4l7.5-17.5c3-7.2 11.4-15.5 18.5-18.5l17.5-7.5c7.2-3.1 7-7.7-.4-10.2zM231 69c3.5.8 7 1.7 10.7 2.4 4.3 1 8.4 1.6 12.3 2L173.2 154c-1.1 1-2.2-.2-2.2-.2l-52.5-52.6c-.9-1-.5-1.6-.2-1.9 49.9-45 80.4-37.9 112.6-30.4zm-158 185.3c-.3-3.9-1-8-2-12.4l-.4-1.8c-7.8-35.6-16-72.4 30.7-123.7.3-.3 1.2-.6 2 .3l53 53s.5.9-.3 1.7l-83 83z';
        case 'cav1':
            return 'M82.2 50c-.5-.2-13.1-3-12.6-22.7.3-10.7-6.3-18.8-19.2-23.5A69.4 69.4 0 0 0 31.7 0a3 3 0 0 0-2.9 2.3 3 3 0 0 0-2.3 2l-.6 2-1.7-1.7a3 3 0 0 0-3.4-.6l-1.2.6a3 3 0 0 0-1.7 3l.1 1.5c.1 1.4.2 3 .7 4.6.4 1.3.3 2.2-.5 3.4A20.5 20.5 0 0 0 14 30.8c.3 4.3-2.3 8.4-5.3 12.7-3.4 4.9-1.1 9 .3 11.5a9.7 9.7 0 0 0 11 4c2.1-.7 4-2.8 4.6-4.9 1-3.5 3.7-5.4 7-7.6l1.8-1.4 2.6-1.3c1.3 10.6-.2 18.4-5 24.7a19.3 19.3 0 0 0-2.1 20.7l.1.3a3 3 0 0 0 3.6 1.9 58.2 58.2 0 0 0 34.6-27.7c.4.3.9.1 1.2-.2h.7c7.6 0 14.2-7.9 15-8.8a3 3 0 0 0-1.8-4.8zM31.7 88.4c0-.2 0-.4-.2-.6-2.7-6-2.4-11.9 1.8-17.5 6-8.1 6.8-17.5 5.5-27.1-.1-1.3-1-2.4-1.5-3.5-2.3 1.2-4.2 1.8-5.7 3-4 2.8-8.5 5.2-10 10.5a4.9 4.9 0 0 1-2.7 3l-1.7.2c-2.3 0-4.8-1.2-5.7-3-1.5-2.6-2.7-5-.4-8.3 3-4.4 6.2-9.2 5.8-14.6-.3-4.8 1.4-8.2 3.8-11.8a6.5 6.5 0 0 0 .9-6C21 11 21 9 20.9 7.2l1.2-.6 5.3 5 2-6.5L32 9.4l1.6 2.6c.1.4.4.7 1 .7 23 .2 22.4 32 30.6 48.2a55.2 55.2 0 0 1-33.5 27.6zm37.3-28c-.6 0-1.2 0-1.8-.2-8.9-16.5-7.8-48.3-31.6-49.5L31.7 3s35.6 1.6 35 24.2C66 50 81.6 53 81.6 53s-6.3 7.7-12.7 7.7z';
        case 'cav2':
            return 'M20.9 29.9c-1.3 0-1.3 2 0 2s1.3-2 0-2zM12.5 48.2c-1.1-.6-2.1 1.1-1 1.7.7.4 1.1.9 1 1.7 0 .5.5 1 1 1 .6 0 1-.5 1-1 .2-1.5-.8-2.8-2-3.4z';
        default:
            return undefined;
    }
}
function loadImages(){
    return load([
        '/images/grid/plain1.png',
        '/images/grid/plain2.png',
        '/images/grid/plain3.png',
        '/images/grid/plain4.png',
        '/images/grid/plain5.png',
        '/images/grid/plain6.png',
        '/images/grid/forrest1.png',
        '/images/grid/forrest2.png'
    ]).then(imgs =>{
        return {
            plains: imgs.slice(0, 6),
            forrests: [imgs[6], imgs[7]]
        };
    });
}
function createTerrainLayer(){
    var layer = new Konva.Layer();

    layer.addGridNodes = (grid, nodeCallback) => {
        var minX = 999999999;
        var minY = 999999999;
        var maxX = 0;
        var maxY = 0;
        layer.destroyChildren();
        grid.getHexes().sort((a, b) => {
            a.points.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            });            

            if (a.y > b.y) return 1;
            if (a.y < b.y) return -1;
        
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
        
            return 0;
        })
        .map(hex => nodeCallback(hex))
        .forEach(node => {
            layer.add(node.node);
            layer.add(node.coord);
        });

        layer.setHeight(Math.abs(minY) + Math.abs(maxY));
        layer.setWidth(Math.abs(minX) + Math.abs(maxX));
    }

    return layer;
}
function createTooltipLayer(stage){
    var tooltipLayer = new Konva.Layer();

    var tooltip = createTooltipVisual();

    tooltipLayer.add(tooltip.node);

    function updateTooltipWithUnitStats(unit){
        var mousePos = stage.getPointerPosition();
        var texts = [
            `Endurance: ${unit.endurance} / ${unit.lifetime.endurance}`,
            `Mobility: ${unit.mobility} / ${unit.lifetime.mobility}`,
            `Agility: ${unit.agility} / ${unit.lifetime.agility}`,
            `Damage: ${unit.damage}`,
            `Armor: ${unit.armor}`,
            `Range: ${unit.range}`,
        ];
        tooltip.show(texts, mousePos, texts.length);
        tooltipLayer.batchDraw();
    }

    function updateTooltipWithMoveStats(unit, cost){
        var mousePos = stage.getPointerPosition();
        if (cost <= unit.mobility){
            var texts = [
                `Moves: ${cost} / ${unit.mobility}`,
                `Charge: ${cost}`
            ];
            if (unit.agility && cost == unit.mobility){
                texts.push(`Agility: -${unit.agility}`);
            }
            tooltip.show(texts, mousePos, texts.length);
            tooltipLayer.batchDraw();
        }
    }

    function updateTooltipWithAttackStats(aUnit, tUnit){
        var dmg = Damage().getChargeDamage(aUnit, tUnit);
        var mousePos = stage.getPointerPosition();
        var texts = [
            `Endurance: ${tUnit.endurance}`,
            `-${dmg} damage`
        ];
        tooltip.show(texts, mousePos, texts.length);
        tooltipLayer.batchDraw();
    }

    return {
        node: tooltipLayer,
        updateTooltipWithUnitStats: updateTooltipWithUnitStats,
        updateTooltipWithMoveStats: updateTooltipWithMoveStats,
        updateTooltipWithAttackStats: updateTooltipWithAttackStats,
        hideTooltip: function(){
            tooltip.hide();
            tooltipLayer.draw();
        }
    };
}
function createTooltipVisual(){
    var rect = new Konva.Rect({
        width: 100,
        height: 50,
        cornerRadius: 3,
        fill: 'grey',
        stroke: '#252525',
        strokeWidth: 2,
        opacity: 0.8,
        listening: false,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: {x : 6, y : 6},
        shadowOpacity: 0.5
    });
    var text = new Konva.Text({
        fontFamily: "Calibri",
        fontSize: 11,
        padding: 5,
        fill: "#dedede",
        listening: false/*,
        shadowColor: 'black',
        shadowBlur: 0,
        shadowOffset: {x : 2, y : 2},
        shadowOpacity: 0.5*/
    });

    var group = new Konva.Group({
        listening: false
    });

    group.add(rect);
    group.add(text);
    group.hide();

    return {
        show: (txt, position, lines) => {
            if (!lines){
                lines = 1;
            }
            text.text(txt.join('\n'));
            group.position({
                x : position.x + 5,
                y : position.y + 5
            });
            rect.height(10 + lines * 11);
            group.show();
        },
        hide: () => {
            group.hide();
        },
        node: group
    };
}
function createUnitLayer(center, grid, animator){
    var layer = new Konva.Layer();

    var armyColors = [
        '#00cc00',
        '#c80b04'
    ];
    var unitNodes = [];

    grid.getUnits().forEach(unit => {
        var hex = grid.getHexAt(unit.pos.x, unit.pos.y);
        addUnit(unit, hex.center);
    });

    function addUnitNode(unit, hexCenter, isPlayerArmy) {
        var unitSceneNode = unit.endurance > 0
            ? createUnitVisual(unit, center, hexCenter, isPlayerArmy ? armyColors[0] : armyColors[1])
            : createDeadUnitVisual(unit, center, hexCenter);
        animator.registerAnimation(unit.id, unitSceneNode, center);
        unitNodes.push({ 
            node: unitSceneNode, 
            unit: unit, 
            isPlayerArmy: isPlayerArmy,
            hexCenter: hexCenter 
        });
        return unitSceneNode;
    }

    function addUnit(unit, hexCenter) {
        var unitNode = addUnitNode(unit, hexCenter, grid.isPlayerArmy(unit.id, true));
        layer.add(unitNode);
    }

    return {
        node: layer,
        refresh: () =>{
            layer.destroyChildren();
            var nodes = unitNodes.slice();
            unitNodes = [];
            nodes.forEach(un => {
                var unitNode = addUnitNode(un.unit, un.hexCenter, un.isPlayerArmy);
                unitNode.setX(un.node.getX());
                unitNode.setY(un.node.getY());
                layer.add(unitNode);
            });
            layer.draw();
        }
    };
}
function getUnitMoveAnim(steps, node, center){
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
          node.setY(calcY);
          var sourceX = center.x + currStep.center.x;
          var targetX = center.x + steps[0].center.x;
          var diffX = targetX - sourceX;
          var calcX = sourceX + diffX * progress;
          node.setX(calcX);
          if ((diffX > 0 && calcX >= targetX) || (diffX < 0 && calcX <= targetX) ||
            (diffY > 0 && calcY >= targetY) || (diffY < 0 && calcY <= targetY)){
              currStep = steps.shift();
            frame.time = 0; // ????????
            if (!steps.length){
              anim.stop();
              node.setY(targetY);
              node.setX(targetX);
              resolve();
            }
          }
        }, node.getLayer());
      anim.start();
    }
  });
}
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
function createWaitLayer(width, height) {
    var waitLayer = new Konva.Layer();
    var waitOverlay = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: 'black',
        opacity: 0.5
    });
    waitLayer.add(waitOverlay);

    var textWidth = 320;

    function createText(text) {
        return new Konva.Text({
            x: width / 2 - textWidth / 2,
            y: 100,
            text: text,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#555',
            width: textWidth,
            padding: 20,
            align: 'center'
        });
    }

    var complexText = createText();

    var rect = new Konva.Rect({
        x: width / 2 - textWidth / 2,
        y: 100,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: textWidth,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2
    });

    waitLayer.add(rect);
    waitLayer.add(complexText);

    return {
        show: function (text) {
            waitOverlay.show();
            complexText = createText(text);
            waitLayer.add(complexText);
            rect.setHeight(complexText.getHeight());
            rect.show();
            waitLayer.draw();
        },
        hide: function () {
            waitOverlay.hide();
            complexText.destroy();
            rect.hide();
            waitLayer.draw();
        },
        node: waitLayer
    };
}