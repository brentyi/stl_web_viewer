const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewable list */
router.get('/', (req, res, next) => {
    handler.getModels((data) => {
        data.forEach((obj, index, arr) => {
            obj.viewer_url = handler.site_root + '/viewer/' + obj.name;
        });

        var param = {
            models: data
        };
        res.render('list', param);
    });
});

module.exports = router;
