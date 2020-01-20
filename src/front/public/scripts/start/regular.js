(function start (){  
  var eventBus = new EventBus();
  var battle = new Game.Battle(eventBus);
  
  Promise.all([loadImages(), initWebSocket(eventBus)]).then(r => {
    battle.loadData(r[1]);
    var grid = initGrid(battle);
    setupStage(grid, eventBus, r[0]);
  });
})();