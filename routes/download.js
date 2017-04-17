const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();
const path = require('path');

/* Model download route */
router.get('/:name', (req, res, next) => {

    console.log(req.params);
    var name = parseInt(req.params.name);
    handler.getModel(name, (data) => {
        console.log('------------');
        console.log('Downloading model');
        console.log(data);
        console.log('------------');
        res.attachment(data.original_filename || 'model.stl');
        res.sendFile('model-' + data.name + '.stl',  { root : path.join(__dirname, '../assets/uploads')});
    });
});

module.exports = router;
