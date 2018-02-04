(function start (){  
  loadImages().then(imgs => {
    var animator = new Animator();
    var battle = new Game.Battle();
    
    var ws = new WebSocket('ws://' + window.location.host + '?bid=' + sessionStorage.getItem('battleid'));
    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      if (data.msg == 'data'){
        battle.loadData(data.data);
        var grid = initGrid(battle);
        setupStage(grid, animator, imgs);
      }
      else if (data.msg == 'upd'){
        var currUnit = battle.onUpdate(data.data);
      }
    };
  });
})();