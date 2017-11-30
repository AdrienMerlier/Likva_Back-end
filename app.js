var express = require('express');
var session = require('express-session');
var passport = require('passport');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');


//Database setup
var url = 'mongodb://mongo:27017/likva';
mongoose.connect(url, {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var dbvotes = db.collection('votesAndEmargements');
var dbpropositions = db.collection('categoriesAndPropositions');
var dbteams = db.collection('teams');
var dbusers = db.collection('users');

 

//Hashing parameters
var bcrypt = require('bcrypt-nodejs');

require('./models/user.js');
require('./models/proposition.js');
require('./models/team.js');
require('./models/teamUsers.js');
require('./models/teamPropositions.js');
require('./models/teamVotes.js');
require('./routes')(app);

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + '/templateLogReg'));



app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});

