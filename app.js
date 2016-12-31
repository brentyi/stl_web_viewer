const express = require('express');
const multer = require('multer');

var app = express();
app.set('port', process.env.port || 5001);
app.use(express.static('public'));

/* Disk Storage engine of multer gives you full control on storing files to disk. The options are destination (for determining which folder the file should be saved) and filename (name of the file inside the folder) */

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, request.fsname || file.originalname)
    }
});

var upload = multer({storage: storage}).single('model');

app.get('/', function(resuest, response) {
    response.sendFile('index.html');
});

//Posting the file upload
app.post('/upload', function(request, response) {
    request.fsname = "model-" + Date.now() + ".stl";
    upload(request, response, function(err) {
        if(err) {
            console.log('Error Occured: ', err);
            return;
        }
        console.log(request.file);
        response.end('Your File Uploaded');
        console.log('File Uploaded');
    })
});

app.listen(app.get('port'), function () {
    console.log('Listening on port ', app.get('port'))
});
