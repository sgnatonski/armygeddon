var express = require('express');
var router = express.Router();
var tmpl = require('@internal/common/storage/arango/arango_storage').battleTemplates;

router.get('/', function(req, res, next) {
  res.render('design', { title: 'Design battle' });
});

router.post('/save', async function(req, res, next) {
  var t = {
    id: 'battle.' + req.body.name,
    terrain: req.body.terrain,
    sceneSize: getSceneSize(req.body.terrain)
  };
  await tmpl.store(t);
  res.json(true);
});

function getSceneSize(terrain){
  var tx = terrain.map(x => x.x);
  var ty = terrain.map(x => x.y);
  var minX = Math.abs(Math.min(...tx));
  var maxX = Math.abs(Math.max(...tx));
  var minY = Math.abs(Math.min(...ty));
  var maxY = Math.abs(Math.max(...ty));
  var sceneSize = Math.max(...[minX, maxX, minY, maxY]);
  return sceneSize;
} 

module.exports = router;
