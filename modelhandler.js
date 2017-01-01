const multer = require('multer');
const mongodb = require('mongodb');

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

var db;
var db_models;

var db_url = 'mongodb://localhost:27017/stl_web_viewer';
var MongoClient = mongodb.MongoClient;

// Use connect method to connect to the Server
MongoClient.connect(db_url, (err, database) => {
    if (err) {
        console.error('Unable to connect to the mongoDB server. Error:', err);
    }
    console.log('Connection established to', db_url);
    db = database;
    db_models = db.collection('models');
});

module.exports.uploadModel = (request, response) => {
    var model_name = Date.now();
    request.fsname = 'model-' + model_name + '.stl';
    console.log('Starting file upload');
    upload(request, response, (err) => {
        if(err) {
            console.log('Error Occured: ', err);
            return;
        }

        console.log('Uploaded model to ' + request.file.path);

        var host = (request.headers['x-forwarded-host'] || request.header.host);
        var url = 'http://' + host + '/uploads/' + request.file.filename;

        var date = new Date();
        var expiration = new Date(date.setTime( date.getTime() + 1/*days*/ * 86400000 ));
        db_models.insert({
            name: model_name,
            url: url,
            path: request.file.path,
            expiration: expiration
        });

        response.json({
            url: url,
            embed: 'http://' + host + '/viewer/' + model_name
        });
    })
}

module.exports.getModel = (name, cb) => {
    var model = db_models.findOne({name: name}, (err, item) => {
        console.log(err);
        console.log(item);

        cb(item);
    });
}

