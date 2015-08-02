var SALT_WORK_FACTOR = 10;
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/ms');

// LIST users function
exports.list = function(req, res) {
	db.bind('msusers');
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

// ADD users function
exports.add = function(req, res) {
	db.bind('msusers');
	var bcrypt = require('bcrypt');

	// Auto-Incrementing Sequence UserID
  db.collection('counters').findAndModify({ _id: "userid" }, {}, { $inc: { seq: 1 } }, { new: true }, function(err, doc) { 
		var user = {
	     "_id": doc.seq,
	     "name": "Juan Carlos",
	     "last_name": "Jimenez",
	     "email": "jc@jcjimenez.me",
	     "bdate": "31-05-1976",
	     "password": "password"
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