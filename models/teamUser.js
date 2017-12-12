var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	slug: String,
	email : String,
	admin : Boolean,
	proposer : Boolean,
	status : String,
	delegable: Boolean,
	description: String,
	delegation : []
});

mongoose.model('TeamUser', teamUserModelSchema);