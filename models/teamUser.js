var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamUserModelSchema = new Schema({
	slug: String,
	email : String,
	displayName: String,
	admin : Boolean,
	proposer : Boolean,
	status : String,
	delegable: Boolean,
	description: String,
	delegation : [{
		categoryName : String, 
  		delegate : String
	}]
});

mongoose.model('TeamUser', teamUserModelSchema);
