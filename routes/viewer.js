const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewer */
router.get('/:name', (req, res, next) => {
    var name = parseInt(req.params.name);
    handler.getModel(name, (data) => {
        console.log('------------');
        console.log('Viewing model');
        console.log(data);
        console.log('------------');
        var param = {
            styles: ['viewer'],
            model_url: handler.site_root + '/download/' + name
        };
        res.render('viewer', param);
    });
});

module.exports = router;
