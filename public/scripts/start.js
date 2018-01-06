(function start (){
  var battle = new Game.Battle();
  battle.load().then(() => {
    var grid = initGrid(battle);
    setupStage(grid);    
    grid.hexSelected();
  })
})();