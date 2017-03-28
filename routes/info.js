const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewer */
router.get('/:name', (req, res, next) => {
    console.log(req.params);
    handler.getModel(parseInt(req.params.name), (data) => {
        var param = {
            styles: ['viewer'],
            model_url: data.url
        };
        res.render('info', param);
    });
});

module.exports = router;
