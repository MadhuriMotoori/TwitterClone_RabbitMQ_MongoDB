var bcrypt = require('bcrypt');
var sequencegenerator = require('./sequencegenerator');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";

function register(msg, callback) {
	var username = msg.username;
	var email = msg.email;
	var password = msg.password;
	var firstname = msg.firstname;
	var lastname = msg.lastname;
	var gender = msg.gender;
	var dob = msg.dob;
	var json_responses = {};
	if (username != undefined && email != undefined && password != undefined
			&& firstname != undefined && lastname != undefined
			&& gender != undefined && dob != undefined) {
		mongo.connect(mongoURL, function(db) {
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({username : username}).toArray(function(err, user) {
				if (err) {
					throw err;
				} else {
					console.log("user details:" + user.length);
					if (user.length > 0) {
						console.log("Entered username error");
						json_responses = {
							"statusCode" : 401,
							"error" : "Username Exists"
						};
						callback(null, json_responses);
					} else {
						coll.find({ email : email}).toArray(function(err, user) {
							if (user.length > 0) {
								console.log("Entered email error");
								json_responses = {"statusCode" : 401,
												   "error" : "Email Exists"};
								callback(null, json_responses);

							} else {
								var passwordhash = bcrypt.hashSync(password, 10);
								sequencegenerator.getNextSeqNumber("userId",function(seqId){
									var userInfo = { _id: seqId, username: username, email: email, password: passwordhash,
											firstname: firstname, lastname: lastname, gender : gender, dob: dob, tweets:[], 
											following: [], followers:[], phonenumber: "", location: ""};
									
									coll.insert(userInfo, function(err, docs){
										
										console.log("data after insert "+ docs);
										if(err)
											throw err;
										
									      if(docs) {
									    	  
									    	  coll.find({email: email, password: passwordhash}).toArray(function(err, docs){
													
													console.log("data after insert "+ docs);
													if(err)
														throw err;
													
												      if(docs.length == 1){
															console.log("user entering into home page");

															json_responses = {"statusCode" : 200,
																	"results": docs[0]
																	   };
															callback(null, json_responses);
												      }
												      else{
												    	  json_responses = {"statusCode" : 201}
															callback(null, json_responses);
												      }
												    	 
												});
									      }	  
									      else{
									  		json_responses = {
									  				"statusCode" : 401,
									  				"error" : "Values not defined"
									  			};
									  			callback(null, json_responses);
									      }
									    	  
									});
									});
							}
						});
					}
				}
			});
		});

	} else {
		json_responses = {
			"statusCode" : 401,
			"error" : "Values not defined"
		};
		callback(null, json_responses);
	}
}

exports.register = register;

