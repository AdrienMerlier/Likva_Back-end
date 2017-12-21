module.exports = function(app){

	require('../models/user');
	require('../models/teamUser');
	require('../models/team');
    require('../models/vote')
    var teams = require('../controllers/team');
    var teamUsers = require('../controllers/teamUser');

    app.get('/api/teams', teams.findAll);
    app.get('/api/teams/:teamId', teams.findById);
    app.get('/api/teams/:teamId/delegates', teamUsers.findDelegates);
    app.get('/api/teams/:teamId/categories/', teams.findCategories);
    app.post('/api/teams/', teams.add);
    app.post('/api/teams/:teamId/join', teams.addSimpleUser);
    app.post('/api/teams/:teamId//admin/addUser', teams.addUserViaAdmin);
    app.post('/api/teams/:teamId/categories/', teams.addCategory);
    app.post('/api/teams/:teamId/categories/categoryId/', teamUsers.addDelegate);
    app.put('/api/teams/:teamId', teams.updateTeam);
    app.put('/api/teams/:teamId/password', teams.updateTeamPassword);
    app.delete('/api/teams/:teamId', teams.delete);

}