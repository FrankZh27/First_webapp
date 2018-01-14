var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var app = express();
var p = process.env.PORT;

const JWT_SECRET = 'frankbbs';

var db = null;
// var url = "mongodb://localhost";
const url = "mongodb://localhost:27017";
const dbname = "mittens";
var uri = "mongodb://heroku_b3nltvhl:4mv4cds2q4qu3odaah218uugom@ds255767.mlab.com:55767/heroku_b3nltvhl";


// -----This is the 2.x version mongodb connect to Nodejs
// MongoClient.connect(url, function(err, dbconn){
// 	if(!err) {
// 		console.log("We are connected");
// 		db = dbconn;
// 	}
// });

// This is the 3.x version mongodb connect to Nodejs
MongoClient.connect(uri || url, function(err, client){
	if(!err) {
		console.log("We are connected to MongoDB");
		db = client.db("heroku_b3nltvhl");
		//db = client.db(dbname);
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
	
	var token = req.headers.authorization;
	var user = jwt.decode(token, JWT_SECRET);

	db.collection('greetings', function(err, greetingsCollection) {
		var newGreeting = {
			text: req.body.newGreeting,
			userId: user._id,
			username: user.username
		}
		
		greetingsCollection.insert(newGreeting, {w:1}, function(err) {
			return res.send();
		});
	});
});


app.put('/greetings/remove', function(req, res, next){
	
	var token = req.headers.authorization;
	var user = jwt.decode(token, JWT_SECRET);

	db.collection('greetings', function(err, greetingsCollection) {
		var greetingId = req.body.greeting._id;
		greetingsCollection.remove({_id: ObjectId(greetingId), userId: user._id}, {w:1}, function(err) {
			return res.send();
		});
	});
});

app.post('/users', function(req, res, next){
	db.collection('users', function(err, usersCollection) {
		
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(req.body.password, salt, function(err, hash) {
				var newUser = {
					username: req.body.username,
					password: hash
				};

				usersCollection.insert(newUser, {w:1}, function(err) {
					return res.send();
				});
			});
		});

		
	});
});


app.put('/users/signin', function(req, res, next){
	
	db.collection('users', function(err, usersCollection) {
		
		usersCollection.findOne({username: req.body.username}, function(err, user) {
			
			bcrypt.compare(req.body.password, user.password,function(err, result) {
				if (result) {
					var mytoken = jwt.encode(user, JWT_SECRET);
					return res.json({token: mytoken});
				} else {
					return res.status(400).send();
				}
			});
		});
		
	});
});

//app.listen(3000, function(){
app.listen(p, function() {
	console.log('Listening on port ', p);
});