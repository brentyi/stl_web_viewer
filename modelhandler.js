const multer = require('multer');
const mongodb = require('mongodb');
const config = require('config');

var storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'assets/uploads');
    },
    filename: (request, file, callback) => {
        var name = request.fsname || file.originalname;
        callback(null, name)
    }
});
var upload = multer({
    storage: storage,
    limits: {fileSize: config.get('filesize_max_mb') * 1024 * 1024}
}).single('model');

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

        db_models.insert({
            name: model_name,
            url: url,
            path: request.file.path,
            views: 0,
            last_viewed: new Date()
        });

        response.json({
            url: url,
            embed: 'http://' + host + '/viewer/' + model_name
        });
    })
}

module.exports.getModel = (name, cb) => {
    var model = db_models.findOne({name: name}, (err, item) => {
        if(!item) {
            console.log("nonexistent model!");
            return;
        }

        db_models.update({_id: item._id}, {$set: {last_viewed: new Date(), views: ++item.views}});

        console.log(err);
        console.log(item);

        cb(item);
    });
}

