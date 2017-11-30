module.exports = function(app){
    var users = require('./controllers/user');
    app.get('/api/users', users.findAll);
    app.get('/api/users/:id', users.findById);
    app.post('/api/users/', users.add);
    app.put('/api/users/:id', users.update);
    app.delete('/api/users/:id', users.delete);
}
