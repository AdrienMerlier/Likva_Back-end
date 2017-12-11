var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var emargementModelSchema = new Schema({
	_id: String,
	slug : String,
	propId : String,
	email: String,
});

var Emargement = mongoose.model('Emargement', emargementModelSchema);