const express = require('express');
const handler = require('../modelhandler');
const router = express.Router();

/* Homepage */
router.get('/', (req, res, next) => {
    res.render('uploader', {styles: ['uploader']});
});

//Posting the file upload
router.post('/upload', handler.uploadModel);

module.exports = router;
