var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	_id: String,
	name : String,
	password: String,
	teamType: String,
	users : [[]]
});

var TeamUser = mongoose.model('TeamUser', teamUserModelSchema);
