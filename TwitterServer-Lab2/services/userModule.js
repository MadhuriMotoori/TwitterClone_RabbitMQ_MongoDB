var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";
var sequencegenerator = require('./sequencegenerator');

exports.followingList = function(msg, callback){
	var user_id = msg.user_id;

	if(user_id != undefined && user_id != "") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.findOne({_id : user_id},{ _id : false}, function(err, result){
				var list = result.following;
				var followerlist = result.followers;
				var tweetlist = result.tweets;
				var results = [];
				console.log("list values" + list.toString());
				coll.find({_id: { $in: list } }, {username: true, firstname: true, _id: false}).toArray(function(err, results){
					console.log("Resultsvalues" +  results[0]);
					json_responses = {"statusCode" : 200,
							"followingList": results,
							"following" : list.length,
							"usertweet" : tweetlist.length,
							"followers" : followerlist.length,
							"firstname" : result.firstname,
							"username"  : result.username
					   };
					console.log("values are " + JSON.stringify(json_responses));
					callback(null, json_responses);
				});
			});
		});
	} else {
		json_responses = {"statusCode" : 401};
		callback(null, json_responses);		
	}
}



exports.followersList = function(msg, callback){
	var user_id = msg.user_id;
	if(user_id != undefined && user_id != "") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.findOne({_id : user_id},{ _id : false}, function(err, result){
				var list = result.followers;
				var followinglist = result.following;
				var tweetlist = result.tweets;
				var results = [];
				console.log("list values" + list.toString());
				coll.find({_id: { $in: list } }, {username: true, firstname: true, _id: false}).toArray(function(err, results){
					console.log("Resultsvalues" +  results[0]);
					json_responses = {"statusCode" : 200,
							"followingList": results,
							"following" : followinglist.length,
							"usertweet" : tweetlist.length,
							"followers" : list.length,
							"firstname" : result.firstname,
							"username"  : result.username
					   };
					console.log("values are " + JSON.stringify(json_responses));
					callback(null, json_responses);
				});
			});
		});
	} else {
		json_responses = {"statusCode" : 401};
		callback(null, json_responses);		
	}
	
}


exports.profileupdate = function(msg, callback){
	var user_id= msg.user_id;
	var firstname = msg.firstname;
	var location = msg.location;
	var phonenumber = msg.phonenumber;
	
	mongo.connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = db.collection('users');

		coll.updateOne({_id: user_id}, {$set: {phonenumber :phonenumber, location: location}}, function(err, result){
			if(err){
				json_responses = {"statusCode" : 401,
				};
				
				callback(null, json_responses);
			}
			else 
			{		
				json_responses = {"statusCode" : 200,
					};
							
				callback(null, json_responses);

			}  
		});
	});
}