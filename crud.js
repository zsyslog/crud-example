var SALT_WORK_FACTOR = 10;
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/ms');

db.bind('msusers');

// LIST users function
exports.list = function(req, res) {
	var criteria = {};
	var options = {
		"limit": 100, // TODO: limit by a external param
		"sort": [['_id',1]]
	}
	db.msusers.find(criteria, options)
						.toArray(function(e, results){
              if (e) return next(e);
              	for (i in results) {
              		delete results[i].password;
              	}
              	res.send(results);
      			});
}

// Get user by id function
exports.getuser = function(req, res, next) {
	var id = parseInt(req.params.id);
	var criteria = {"_id": id};
	var options = {}
	console.log(criteria)
	db.msusers.find(criteria, options)
		.toArray(function(e, results){
			if (e) return next(e);
      if (results.length === 1) {
      	delete results[0].password;
      	results[0].exists = true;
      	db.collection('images').find({"userid":req.params.id}).toArray(function(err, docs) {
      		console.log(docs);
      		results[0].avatars = [];
      		for (i in docs)
      			results[0].avatars.push(docs[i].url);
      		res.send(results[0]);
      	})
      	
      } else {
      	res.send({_id: id, exists: false});
      }
      	
		});
}

// ADD users function
exports.add = function(req, res) {
	var bcrypt = require('bcrypt');
	console.log(req.body)
	// Auto-Incrementing Sequence UserID
  db.collection('counters').findAndModify({ _id: "userid" }, {}, { $inc: { seq: 1 } }, { new: true }, function(err, doc) { 
		var user = {
	     "_id": doc.seq,
	     "name": req.body.name,
	     "last_name": req.body.last_name,
	     "email": req.body.email,
	     "bdate": req.body.bdate,
	     "password": req.body.password
		}

		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	      user.password = hash;
	      db.msusers.insert(user,{}, function(){
	        console.log(arguments);
	      });
	      user.added = "true";
	      res.send(user);
	    });
		});

	})
}


// USER delete function
exports.delete = function(req, res) {
  var userid = req.params.id; // obtener id del body
  var ret = {
  	"user": userid
  }

  db.msusers.removeById(parseInt(userid), function(error, modified) {
    if (error === null && modified == 1)
      ret.deletion = "success";
    else
      ret.deletion = "error";
    res.send(ret)
  });
}

// USER update function
exports.update = function(req, res) {
	var bcrypt = require('bcrypt');
  var objectid = req.params.id;
  var user;
  var ret = {user: objectid};

  if(req.body.hasOwnProperty('password')) {
    user = {
      $set: {
              name : req.body.name,
              email : req.body.email || '',
              last_name: req.body.last_name,
	     				bdate: req.body.bdate,
              password : req.body.password
      }
    };
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      bcrypt.hash(user.$set.password, salt, function(err, hash) {
        user.$set.password = hash;
        db.msusers.updateById(parseInt(ret.user), user, function(error, modified) {
        	if (error === null && modified == 1)
			      ret.updating = "success";
			    else
			      ret.updating = "error";
			    res.send(ret)
        });
      });
    });
  } else {
    user = {
      $set: {
      	name : req.body.name,
        email : req.body.email || '',
        last_name: req.body.last_name,
 				bdate: req.body.bdate,
      }
    };
    console.log(user);
    db.msusers.updateById(parseInt(ret.user), user, function(error, modified) {
    	console.log(error);
    	console.log(modified)
      if (error === null && modified == 1)
	      ret.updating = "success";
	    else
	      ret.updating = "error";
	    res.send(ret)
    });
  }
}

