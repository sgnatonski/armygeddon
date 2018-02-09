(function start (){  
  loadImages().then(imgs => {
    var eventBus = new EventBus();
    
    initWebSocket(eventBus, data => {
      var battle = new Game.Battle(eventBus);
      battle.loadData(data);
      var grid = initGrid(battle);
      var animator = new Animator();
      setupStage(grid, eventBus, animator, imgs);
    });
  });
})();