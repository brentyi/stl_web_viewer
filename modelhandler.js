const multer = require('multer');
const mongodb = require('mongodb');
const config = require('config');

var size_limit = config.get('filesize_max_mb');
module.exports.size_limit = size_limit;
var site_root = config.get('site_root');
module.exports.site_root = site_root;

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
    limits: {fileSize: size_limit * 1024 * 1024}
}).single('model');

var db;
var db_models;

var db_url = config.get('mongo_url');
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

        var url = site_root + '/uploads/' + request.file.filename;

        db_models.insert({
            name: model_name,
            url: url,
            path: request.file.path,
            views: 0,
            last_viewed: new Date()
        });

        response.json({
            info_url: site_root + '/info/' + model_name
        });
    })
}

module.exports.getModel = (name, cb) => {
    var model = db_models.findOne({name: name}, (err, item) => {
        if(!item) {
            console.log("nonexistent model!");
            return;
        }
        if (err) {
            console.log("get model error! ", err);
            return;
        }

        db_models.update({_id: item._id}, {$set: {last_viewed: new Date(), views: ++item.views}});

        console.log(item);

        cb(item);
    });
}

module.exports.getModels = (cb) => {
    db_models.find().toArray((err, results) => {
        if (err) {
            console.log("get models error! ", err);
            return;
        }
        cb(results);
    });
}
