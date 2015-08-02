var express = require('express');
var app = express();
var crud = require('./crud');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/emoltv', {safe:true});

// Body Parser
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/crud/api/users', crud.list);
app.get('/crud/api/user/:id', crud.getuser);
app.post('/crud/api/user', crud.add);
app.put('/crud/api/user/:id', crud.update);
app.delete('/crud/api/user/:id', crud.delete);

var server = app.listen(6000);