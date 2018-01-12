module.exports = function(app){

	require('../models/proposition');
	require('../models/team');
    var propositions = require('../controllers/proposition');

    app.get('/api/teams/:teamId/propositions', propositions.findAll);
    app.get('/api/teams/:teamId/categories/:category', propositions.findByCategory);
    app.get('/api/teams/:teamId/propositions/:propId', propositions.findById);
    app.get('/api/propositions/author/:email', propositions.findByAuthor);
    app.get('/api/teams/:teamId/propositions/findDelegations', propositions.findDelegations);
    app.get('/api/teams/:teamId/propositions/:propId/delegateCategory', propositions.delegatFinale);
    app.get('/api/teams/:teamId/propositions/:propId/delegateGeneral', propositions.delegateGeneral);
    app.get('/api/teams/:teamId/propositions/:propId/results', propositions.getResults);
    app.post('/api/teams/:teamId/propositions', propositions.add);
    app.put('/api/teams/:teamId/propositions/:propId', propositions.update);
    app.delete('/api/teams/:teamId/propositions/:propId', propositions.delete);

}