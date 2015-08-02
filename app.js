var express = require('express');
var app = express();
var crud = require('./crud');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/emoltv', {safe:true});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/crud', crud.test);

var server = app.listen(6000);