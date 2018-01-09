module.exports = function(app){


	var mongoose = require('mongoose');

	require('./models/user');
  var users = require('./controllers/user');
  User = mongoose.model('User');


  var bcrypt = require('bcrypt-nodejs');
  var jwt = require('jsonwebtoken'); 

  var cors = require('cors');

  var allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];
  app.use(cors({
    origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
    }
  }));

    app.get('/', function(req, res) {
    	res.send('Hello! The API is at http://localhost:3000/');
	});

  require('./routes/user')(app);

  
  
    //Login route
    app.post('/login', function(req, res) {



        User.findOne({ email: req.body.logemail}, function(err, user) {

            if (err) throw err;

            if (!user) {
              res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                //Replace bottom section accocording to https://www.npmjs.com/package/bcrypt (as callback)

              // check if password matches 
              if (!bcrypt.compareSync(req.body.logpassword, user.password)) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
              } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
               
                
                const payload = {
                  admin: false //To adapt
                };
                var token = jwt.sign(payload, 'LikvaLikva', app.get('neverendingLikva'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });
                

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your login!',
                  token: token,
                  user:{
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    teams: user.teams,
                  }
                });
              }   

            }

         });
    });

    /*

    //Middleware protection for the api
    app.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, 'LikvaLikva', app.get('neverendingLikva'), function(err, decoded) {      
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    req.decoded = decoded;    
                    next();
                }
            });

        } else {
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });

        }
    });

    */
    
    
    
    require('./routes/user')(app);
    require('./routes/team')(app);
    require('./routes/proposition')(app);
    require('./routes/emargement')(app);
    require('./routes/vote')(app);

}
