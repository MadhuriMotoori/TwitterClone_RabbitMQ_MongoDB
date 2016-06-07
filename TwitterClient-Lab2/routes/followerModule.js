var ejs = require("ejs");
var mq_client = require('../rpc/client');

function followUserMainPage(req, res){
	var followUsername = req.params.user;

	var msg_payload = {"followUsername": followUsername, "type": "followuserpage"};
	mq_client.make_request('follower_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 200){
				req.session.follower = results.results;
				ejs.renderFile('./views/followUserMainPage.ejs', {data: results.results}, function(err, result) {
					   if (!err) {
					            res.end(result);
					   } else {
					            res.end('An error occurred');
					            console.log(err);
					   }
				   });
			} else {
				res.redirect('/homePage');
			}
		}  
	});
}

function followUser(req, res){
	var tofollowUser = req.session.follower.username;
	var userId = req.session.user._id;
	
	var msg_payload = {"tofollowUser" : tofollowUser, "userId": userId, "type": "followUser"};
	mq_client.make_request('follower_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 200){
				req.session.follower = null;
			}
			res.send(results);
		}  
	});
}

function followUserDetails(req, res) {
	var tofollowUser = req.session.follower.username;
	var followingUserId = req.session.follower._id;
	var userId = req.session.user._id;

	var msg_payload = {"tofollowUser": tofollowUser, "followingUserId": followingUserId, "userId": userId, "type": "followUserDetails"};
	mq_client.make_request('follower_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);
		}  
	});
}

exports.followUserMainPage=followUserMainPage;
exports.followUser=followUser;
exports.followUserDetails=followUserDetails;