var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var propositionModelSchema = new Schema({
	_id: String,
	slug: String,
	category: String,
	title : String,
	author: String,
	authorLink: String,
	summary : String,
	description : String,
	change : String,
	consequences : String,
	document1 : String,
	document2 : String,
	document3 : String,
	document4 : String,
	document5 : String,
	information: String,
	quorum : Number,
	type: String,
	date : Date,
	votePossibilities: [String],
	results: [],
	verdict: String
});

var Proposition = mongoose.model('Proposition', propositionModelSchema);