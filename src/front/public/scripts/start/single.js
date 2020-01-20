(function start (){
  var eventBus = new EventBus();
  var battle = new Game.Battle(eventBus);
  
  Promise.all([loadImages(), battle.load()]).then(r => {
    var grid = initGrid(battle);
    setupStage(grid, eventBus, r[0]);
  })
})();