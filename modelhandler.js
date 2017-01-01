const multer = require('multer');


var storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'assets/uploads');
    },
    filename: (request, file, callback) => {
        var name = request.fsname || file.originalname;
        callback(null, name)
    }
});
var upload = multer({storage: storage}).single('model');

module.exports.uploadModel = (request, response) => {
    request.fsname = 'model-' + Date.now() + '.stl';
    console.log('Starting file upload');
    upload(request, response, (err) => {
        if(err) {
            console.log('Error Occured: ', err);
            return;
        }
        console.log('Uploaded model to ' + request.file.path);

        var host = (request.headers['x-forwarded-host'] || request.header.host);
        response.json({
            url: 'http://' + host + '/uploads/' + request.file.filename
        });
        console.log(request);
        //response.json(request);
    })
}
