var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/greetings', function(req, res, next){
	
	return res.send(greetings);
});

app.post('/greetings', function(req, res, next){
	greetings.push(req.body.newGreeting);
	res.send();
});

app.listen(3000, function(){
	console.log('example');
});