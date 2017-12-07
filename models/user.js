var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var userModelSchema = new Schema({
	_id: String,
	name : String,
	surname : String,
	username : String,
	password : String,
	email : String,
  teams: [[]]
});

//authenticate input against database

userModelSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

mongoose.model('User', userModelSchema);
