var express = require('express');
var router = express.Router();

function single(prod){
    return function (req, res, next) {
        res.render('single', { title: 'Single battle', prod: prod } );
    }
}

module.exports = {
    dev: () => {
        router.get('/', single(false));
        return router;
    },
    prod: () => {
        router.get('/', single(true));
        return router;
    }
};