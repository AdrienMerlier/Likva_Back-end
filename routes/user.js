module.exports = function(app){

	require('../models/user');
    var users = require('../controllers/user');

    app.get('/api/users', users.findAll);
    app.get('/api/users/:id', users.findById);
    app.post('/api/users/', users.add);
    app.put('/api/users/:id', users.updatePassword);
    app.delete('/api/users/:id', users.delete);

}