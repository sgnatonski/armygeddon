(function start (){  
  loadImages().then(imgs => {
    var eventBus = new EventBus();
    var battle = new Game.Battle(eventBus);
      
    initWebSocket(eventBus, data => {
      battle.loadData(data);
      var grid = initGrid(battle);
      setupStage(grid, eventBus, imgs);
    });
  });
})();