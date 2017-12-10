var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamModelSchema = new Schema({
	_id: String,
	slug : String,
	displayName: String,
	type: String,
	password : String,
	categories: [{categoryName: String, img: String}]
});

mongoose.model('Team', teamModelSchema);
