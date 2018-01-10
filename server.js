var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();


var db = null;
// var url = "mongodb://localhost";
const url = "mongodb://localhost:27017";
const dbname = "mittens";

// -----This is the 2.x version mongodb connect to Nodejs
// MongoClient.connect(url, function(err, dbconn){
// 	if(!err) {
// 		console.log("We are connected");
// 		db = dbconn;
// 	}
// });

// This is the 3.x version mongodb connect to Nodejs
MongoClient.connect(url, function(err, client){
	if(!err) {
		console.log("We are connected");
		db = client.db(dbname);
	}
});

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/greetings', function(req, res, next) {
	db.collection('greetings', function(err, greetingsCollection) {
		greetingsCollection.find().toArray(function(err, greetings) {
			console.log(greetings);
			return res.json(greetings);
		});
	});
});

app.post('/greetings', function(req, res, next){
	greetings.push(req.body.newGreeting);
	res.send();
});

app.listen(3000, function(){
	console.log('example');
});