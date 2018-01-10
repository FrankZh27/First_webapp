var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();


var db = null;
var url = "mongodb://localhost:27017/mittens";

MongoClient.connect(url, function(err, dbconn){
	if(!err) {
		console.log("We are connected");
		db = dbconn;
	}
});

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/greetings', function(req, res, next) {
	db.collection('greetings', function(err, greetingsCollection) {
		greetingsCollection.find().toArray(function(err, greetings) {
			return res.json(greetings);
		});
	});
	// db.collection('greetings', function(err, greetingsCollection) {
	// 	greetingsCollection.find().toArray(funciton(err, greetings){
	// 		return res.json(greetings);
	// 	});

	// });
});

app.post('/greetings', function(req, res, next){
	greetings.push(req.body.newGreeting);
	res.send();
});

app.listen(3000, function(){
	console.log('example');
});