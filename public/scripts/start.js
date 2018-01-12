(function start (){
  var animator = new Animator();
  var battle = new Game.Battle();
  battle.load().then(() => {
    var grid = initGrid(battle, animator);
    setupStage(grid, animator);    
    grid.hexSelected();
  })
})();