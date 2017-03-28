const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewer */
router.get('/:name', (req, res, next) => {

    console.log(req.params);
    var name = parseInt(req.params.name);
    handler.getModel(name, (data) => {
        var param = {
            styles: ['viewer'],
            model_name: name,
            model_url: data.url,
            site_root: handler.site_root
        };
        res.render('info', param);
    });
});

module.exports = router;
