(function start (){
  var animator = new Animator();
  var battle = new Game.Battle();
  var imgs = load([
    '/images/Tiles/WWT-01.png',
    '/images/Tiles/WWT-07.png'
  ]);
  Promise.all([imgs, battle.load]).then(r => {
    var grid = initGrid(battle, animator);
    setupStage(grid, animator, r[0]);    
    grid.hexSelected();
  })
})();