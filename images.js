var formidable = require('formidable');
var util = require('util');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/ms');

exports.store = function(req, res, next) {

	var form = new formidable.IncomingForm();
  
  form.parse(req, function(err, fields, files) {
    var timestamp = +new Date;
    var destFileName = __dirname + "/uploads/" + timestamp + "_" + files.file.name;
    var fs = require('fs');
    fs.createReadStream(files.file.path)
    	.pipe(fs.createWriteStream(destFileName));
    var destUrl = "/uploads/" + timestamp + "_" + files.file.name;
    var image = {
    	userid: fields._id,
    	url: destUrl
    }

    db.collection('images').insert(image, {}, function(){
    	res.json({"file": destUrl});
    })
		

  });
}