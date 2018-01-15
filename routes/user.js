module.exports = function(app){

	require('../models/user');
    var users = require('../controllers/user');

    app.get('/api/users', users.findAll);
    app.get('/api/users/:_id', users.findById);
    app.post('/api/users/', users.add);
    app.put('/api/users/:id/', users.update);
    app.put('/api/users/:id/password', users.updatePassword);
    app.delete('/api/users/:id', users.delete);

}