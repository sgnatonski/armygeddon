var express = require('express');
var router = express.Router();
var fs = require('../storage/file_storage');
var battleLogic = require('../logic/battle');

router.get('/', function(req, res, next) {
    res.render('battle', { title: 'Battle' } );
});

router.post('/start', function(req, res, next) {
    fs.get('init.battle').then(data => {
        var battle = battleLogic.init(data, req.user.id);
        
        fs.store(`battle_${battle.id}`, battle)
            .then(result => res.json(battle.id));
    });
});

module.exports = router;