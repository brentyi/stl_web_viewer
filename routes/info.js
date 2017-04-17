const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Model info page */
router.get('/:name', (req, res, next) => {
    var name = parseInt(req.params.name);
    handler.getModel(name, (data) => {
        console.log('------------');
        console.log('Pulling info page for model');
        console.log(data);
        console.log('------------');
        var param = {
            styles: ['viewer'],
            model_name: name,
            filename: data.original_filename || 'model.stl',
            model_url: handler.site_root + '/download/' + name,
            site_root: handler.site_root
        };
        res.render('info', param);
    });
});

module.exports = router;
