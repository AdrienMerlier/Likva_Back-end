var express = require('express');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MongoClient = require('mongoose');
var url = 'mongodb://mongo:27017/likva';



//Database launched
MongoClient.connect(url);


app.get('/', function(req, res){
  res.send("Hello World");
});

app.post('/newUser', function(req, res) {
	res.send('You sent me a new user to add ' + req.body.name + " " + req.body.surname +'.');
})

app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

