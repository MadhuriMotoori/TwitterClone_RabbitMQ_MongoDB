var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";
var sequencegenerator = require('./sequencegenerator');

function followUserMainPage(msg, callback){
	var followUsername = msg.followUsername;
	
	if(followUsername != undefined && followUsername !="") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({username: followUsername}).toArray(function(err, user){
				if (user.length == 1) {
					json_responses = {"statusCode" : 200,
							"results" : user[0]
					};
					console.log(json_responses);
					callback(null, json_responses);

				} else {
					json_responses = {"statusCode" : 201};
					callback(null, json_responses);
				}
			});
		});
	} else {
		json_responses = {"statusCode" : 201};
		callback(null, json_responses);
	}
}

function followUser(msg, callback){
	var tofollowUser = msg.tofollowUser;
	var userId = msg.userId;

	if(tofollowUser != undefined && tofollowUser != "") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({username: tofollowUser}).toArray(function(err, user){
				if (user.length == 1) {
					
					var following = db.collection('following');
					sequencegenerator.getNextSeqNumber("follow", function(seqId){
						following.insert({_id: seqId, userid: userId, followingUserid: user[0]._id}, function(err, docs){
							if(err) throw err;
							if(docs){
								var users = db.collection('users');
								users.update({_id: userId}, {$push : {following : user[0]._id}}, function(err, docs){
									if(docs){
										console.log("User is added to following list");
										users.update({_id: user[0]._id}, {$push : {followers : userId}}, function(err, docs){
											if(docs){
												console.log("follower list is updated");
												
												json_responses = {"statusCode" : 200};
												callback(null, json_responses);		
											}
										});	
									}
								});						
							}
						});
					});
				} else {
					json_responses = {"statusCode" : 401};
					callback(null, json_responses);
				}
			});
		});	
	} else {
		json_responses = {"statusCode" : 401};
		callback(null, json_responses);
	}
}

function followUserDetails(msg, callback) {
	var tofollowUser = msg.tofollowUser;
	
	if(tofollowUser != undefined && tofollowUser != "") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({username: tofollowUser}).toArray(function(err, user){
				if (user.length == 1) {
					var followersList = user[0].followers;
					var toFollow;
					if(followersList.indexOf(msg.userId) != -1){
							toFollow = false;
					} else {
							toFollow = true;
					}
					json_responses = {"statusCode" : 200,
							 "follow" : toFollow,
							 "username" : user[0].username,
							 "firstname": user[0].firstname
							 };
					callback(null, json_responses);
				} else {
					json_responses = {"statusCode" : 401};
					callback(null, json_responses);
				}
			});
		});
	} else {
		json_responses = {"statusCode" : 401};
		callback(null, json_responses);	}
}

exports.followUserMainPage=followUserMainPage;
exports.followUser=followUser;
exports.followUserDetails=followUserDetails;