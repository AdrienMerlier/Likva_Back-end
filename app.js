var express = require('express'); 


//Setting parser for requests
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var morgan = require('morgan');

//Database setup
require('./config/db');

require('./routes')(app);

app.use(morgan('dev')); 


app.listen(3000, function(){
  console.log('Likva is listening to you on port 3000!');
});


 