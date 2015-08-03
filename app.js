var express = require('express');
var app = express();
var crud = require('./crud');
var morgan = require('morgan');
var images = require('./images');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/emoltv', {safe:true});

// Body Parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Express logger
app.use(morgan('combined'));

// multer config

app.get('/crud/api/users', crud.list);
app.get('/crud/api/user/:id', crud.getuser);
app.post('/crud/api/user', crud.add);
app.put('/crud/api/user/:id', crud.update);
app.delete('/crud/api/user/:id', crud.delete);
app.post('/crud/api/upload/:id', images.store);

// app.post('/crud/api/upload', upload.single('avatar'), images.store);

var server = app.listen(6000);