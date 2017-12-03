module.exports = function(app){


    app.get('/', function(req, res) {
    	res.send('Hello! The API is at http://localhost:3000/');
	});

	require('./routes/user')(app);


}
