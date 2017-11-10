var express = require('express');
var app = express();
var MongoClient = require('mongoose');

//Database launched
MongoClient.connect("mongodb://mongo:27017");

app.get('/', function(req, res){
  res.send("Hello World");
});

app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});