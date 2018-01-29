var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamModelSchema = new Schema({
	_id: String,
	slug : String,
	displayName: String,
	description: String,
	type: String,
	public: Boolean,
	password : String,
	categories: [{
		categoryName: String,
		categorySlug: String, 
		img: String
	}]
});

mongoose.model('Team', teamModelSchema);
