const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Viewer */
router.get('/:id', (req, res, next) => {
    console.log(req.params);
    var param = {
        styles: ['viewer'],
        model_url: 'https://brentyi.com/public/LeggedBot_Reduced.stl'
    };
    res.render('viewer', param);
});

module.exports = router;
