const express = require('express');
const handlebars  = require('express-handlebars');
const multer = require('multer');

var app = express();
app.set('port', process.env.port || 5001);
app.use(express.static('assets'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* Disk Storage engine of multer gives you full control on storing files to disk. The options are destination (for determining which folder the file should be saved) and filename (name of the file inside the folder) */

var storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'assets/uploads');
    },
    filename: (request, file, callback) => {
        console.log(file);
        callback(null, request.fsname || file.originalname)
    }
});

var upload = multer({storage: storage}).single('model');

app.get('/', (request, response) => {
    response.render("home");
});

app.get('/error', (request, response) => {
    response.render("error");
});

//Posting the file upload
app.post('/upload', (request, response) => {
    request.fsname = "model-" + Date.now() + ".stl";
    upload(request, response, (err) => {
        if(err) {
            console.log('Error Occured: ', err);
            return;
        }
        console.log(request.file);
        response.end('Your File Uploaded');
        console.log('File Uploaded');
    })
});

app.listen(app.get('port'), () => {
    console.log('Listening on port ', app.get('port'))
});
