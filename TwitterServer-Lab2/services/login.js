var bcrypt = require('bcrypt');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";


function handle_request(msg, callback){
	var json_responses={};
	console.log("In handle request:"+ msg.email);
	var email = msg.email; 
	var password = msg.password;

	if(email!= undefined && password != undefined) {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({email: email}).toArray(function(err, user){
				if(err) throw err;
				if (user.length > 0) {
						var passwordhash = user[0].password; 
						var found = bcrypt.compareSync(password, passwordhash);
						if(found) {
							console.log("User entered into his page");

							json_responses = {"statusCode" : 200,
									"results" : user[0]
							   };
							callback(null, json_responses);						
						} else {
							console.log("Password is incorrect, please verify");
							json_responses = {"statusCode" : 401,
									   "error" : "Password Error"};
							callback(null, json_responses);					
						}

				} else {
					console.log("Email is incorrect, please verify");
					json_responses = {"statusCode" : 401,
							   "error" : "Email Error"};
					callback(null, json_responses);
				}
			});
		});
	}  else {
		console.log("Values not entered");
		json_responses = {"statusCode" : 401,
						   "error" : "Value not defined"};
		callback(null, json_responses);
	}
}

exports.handle_request = handle_request;