const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewable list */
router.get('/', (req, res, next) => {
    handler.getModels((data) => {
        data.forEach((obj, index, arr) => {
            obj.info_url = handler.site_root + '/info/' + obj.name;
            var date = new Date(obj.name);
            obj.formatted_name = date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"});

            if (!obj.original_filename)
                obj.original_filename = "(empty)";
        });

        var param = {
            styles: ['list'],
            models: data
        };
        res.render('list', param);
    });
});

module.exports = router;
