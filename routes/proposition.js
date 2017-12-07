module.exports = function(app){

	require('../models/proposition');
	require('../models/team');
    var propositions = require('../controllers/proposition');

    app.get('/api/teams/:teamId/proposition', propositions.findAll);
    app.get('/api/teams/:teamId/categories/:category', propositions.findByCategory);
    app.get('/api/teams/:teamId/proposition/:propId', propositions.findById);
    app.post('/api/teams/:teamId/proposition', propositions.add);
    app.put('/api/teams/:teamId/proposition/:propId', propositions.update);
    app.delete('/api/teams/:teamId/proposition/:propId', propositions.delete);

}