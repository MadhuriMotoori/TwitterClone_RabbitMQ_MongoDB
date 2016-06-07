var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/twittertest";
var sequencegenerator = require('./sequencegenerator');

function tweet(msg, callback){	
	var user_id= msg.user_id;
	var tweetText = msg.tweetText;
	
	if(tweetText != undefined && tweetText !="") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('tweets');
			sequencegenerator.getNextSeqNumber("tweetId",function(seqId){
				coll.insert({ _id : seqId,  tweet:tweetText, userid: user_id, tweetdate: new Date(), 
					username: msg.user_username, firstname: msg.user_firstname}, function(err, docs){
					if(err) throw err;
					if (docs) {
						var users = db.collection('users');
						users.update({_id: user_id}, {$push : {tweets : seqId}}, function(err, docs){
							if(docs){
								json_responses = {"statusCode" : 200 };
								callback(null, json_responses);
							}
						});
					} 
				});
			});	
		});
	} else {
		json_responses = {"statusCode" : 401 };
		callback(null, json_responses);
	}
}

function showtweets(msg, callback) {
	var user_id= msg.user_id;
	var user_firstname = msg.user_firstname;
	var user_username = msg.user_username;

	if(user_id != undefined && user_id !="") {
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('users');

			coll.find({_id: user_id}).toArray(function(err, user){
				var list = user[0].following;
				list.push(user_id);
				console.log("values of list" + list.toString());
				var tweets = db.collection('tweets');
				tweets.find( { userid: { $in: list } }).toArray(function(err, tweetresults){
					var retweets = db.collection('retweets');
					retweets.find( { userid: { $in: list } }).toArray(function(err, retweetresults){
						
						var followerslist = user[0].followers;
						var tweetlist = user[0].tweets;
						
						coll.find({_id: user_id}).toArray(function(err, userdetails){
							var flist = userdetails[0].following;
						json_responses = {"statusCode" : 200,
								"tweets": tweetresults,
								"following" : flist.length,
								"usertweet" : tweetlist.length,
								"followers" : followerslist.length,
								"firstname" : user[0].firstname,
								"username"  : user[0].username,
								"retweets" : retweetresults,
								"dob" : user[0].dob,
								"location": user[0].location,
								"phonenumber": user[0].phonenumber
						   };
						console.log("values are"+ JSON.stringify(json_responses));
						callback(null, json_responses);
						});
					});
				
				});
			});
		});
	} else {
	json_responses = {"statusCode" : 401 };
	callback(null, json_responses);
	}
}



function hashtagtweets(msg, callback){
	var search = msg.search;

	console.log("searchQuery:" + query);
	if(search != undefined && search != ""){
		mongo.connect(mongoURL, function(db){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = db.collection('tweets');

			coll.find({tweet: {$regex: ".*"+ search + "*."}}).toArray(function(err, results){
			
				var retweets = db.collection('retweets');
				retweets.find({retweetcomment: {$regex: ".*"+ search + "*."}}).toArray(function(err, retweetresults){

						
						if(err){
							console.log("DB error while retreiving user information for login");
							throw err;
						}
						else 
						{
							
									json_responses = {"statusCode" : 200,
											"tweets": results,
											"retweets" : retweetresults,
									   };
									callback(null, json_responses);

						}  
			});
		});
	});

} else {
	json_responses = {"statusCode" : 401 };
	callback(null, json_responses);
	}
}


function retweet(msg, callback) {
	var retweetText = msg.retweetText;
	var userid = msg.userid;
	var tweetId = msg.tweetId;
	if(userid != undefined && userid != "" ){
	mongo.connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = db.collection('tweets');
		console.log("entered in" + retweet);
		coll.findOne({_id: tweetId}, function(err, tweet){
			if (tweet) {
				var retweets = db.collection('retweets');
				var inputdata = {userid: userid, retweetusername: msg.username, retweetfirstname: msg.firstname,
						retweetcomment: retweetText, tweet: tweet.tweet, username: tweet.username, firstname: tweet.firstname,
						date: tweet.date, retweetdate: new Date()};
				retweets.insert(inputdata,function(err, result){
					if(err){
						console.log("DB error while retreiving user information for login");
						throw err;
					}
					else 
					{
						json_responses = {"statusCode" : 200,};
						callback(null, json_responses);

					} 
				});

			} else {
				json_responses = {"statusCode" : 401 };
				callback(null, json_responses);
			}
		});
	});
	} else {
		json_responses = {"statusCode" : 401 };
		callback(null, json_responses);
	}
}


exports.tweet=tweet;
exports.showtweets=showtweets;
exports.hashtagtweets = hashtagtweets;
exports.retweet = retweet;