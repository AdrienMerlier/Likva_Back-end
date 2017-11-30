var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var teamPropositionsModelSchema = new Schema({
	_id: String,
	name: String,
	categories: [[]]
});

var TeamPropositions = mongoose.model('TeamPropositions', teamPropositionsModelSchema)
