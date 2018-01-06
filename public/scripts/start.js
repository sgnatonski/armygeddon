(function start (){
  var battle = new Game.Battle();
  battle.load().then(() => {
    var grid = initScene(battle);
    setupStage(grid);    
    var unit = battle.nextUnit();
    grid.setSelectedHex(unit.pos.x, unit.pos.y);
  })
})();