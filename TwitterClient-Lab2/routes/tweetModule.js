var ejs = require("ejs");
var mq_client = require('../rpc/client');


function tweet(req, res){	
	var user_id= req.session.user._id;
	var user_username = req.session.user.username;
	var user_firstname = req.session.user.firstname;
	var tweetText = req.param("tweet");

	var msg_payload = {"user_id": user_id, "tweetText": tweetText, "user_username":user_username,
			"user_firstname": user_firstname, "type":"insertTweet" };
	mq_client.make_request('tweets_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 200){
				res.redirect('/loginPageTweets');
			} else {
				res.send(results);
			}
		}  
	});
}

function showtweets(req, res) {
	var user_id= req.session.user._id;
	var user_firstname = req.session.user.firstname;
	var user_username = req.session.user.username;
	var msg_payload = {"user_id": user_id, "user_firstname" : user_firstname , "user_username" : user_username,"type": "showTweets"};
	mq_client.make_request('tweets_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);
		}  
	});
}

function hashtagtweets(req, res){
	var search = req.param("search");
	var msg_payload = {"search": search, "type" : "searchTweets"};
	mq_client.make_request('tweets_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);
		}  
	});
}


function retweet(req, res) {
	var retweetText = req.param("retweetText");
	var userid = req.session.user._id;
	var username = req.session.user.username;
	var firstname = req.session.user.firstname;
	var tweetId = req.param("retweetId");
	
	var msg_payload = {"retweetText": retweetText, "userid": userid, "tweetId": tweetId,
			"username": username, "firstname": firstname, "type": "retweetTweets"};
	mq_client.make_request('tweets_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);
		}  
	});
}

exports.tweet=tweet;
exports.showtweets=showtweets;
exports.hashtagtweets = hashtagtweets;
exports.retweet = retweet;