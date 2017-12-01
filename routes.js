module.exports = function(app){

	require('./routes/user')(app);



    app.get('/', function(req, res) {
    	res.send('Hello! The API is at http://localhost:3000/');
	});

}
