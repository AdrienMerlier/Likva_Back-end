module.exports = function(app){

	require('../models/user');
	require('../models/teamUser');
	require('../models/team');
    var teams = require('../controllers/team');

    app.get('/api/teams', teams.findAll);
    app.get('/api/teams/:teamId', teams.findById);
    app.get('/api/teams/:teamId/categories/', teams.findCategories);
    app.post('/api/teams/', teams.add);
    app.post('/api/teams/:teamId/categories/', teams.addCategory);
    app.put('/api/teams/:teamId', teams.updateTeam);
    app.put('/api/teams/:teamId/password', teams.updateTeamPassword);
    app.delete('/api/teams/:teamId', teams.delete);

}