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