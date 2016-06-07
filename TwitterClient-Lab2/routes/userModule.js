var ejs = require("ejs");
var mq_client = require('../rpc/client');

//Redirects to the homepage
exports.followingPage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to following page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userFollowingMainPage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.followingList = function(req, res){
	var user_id = req.session.user._id;
	var user_firstname = req.session.user.firstname;
	var user_username = req.session.user.username;
	
	var msg_payload = {"user_id" : user_id, "user_firstname": user_firstname, "user_username" : user_username, "type": "followingList"};
	mq_client.make_request('showlist_queue',msg_payload, function(err,results){
		
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

exports.followersPage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to following page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userFollowersMainPage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.followersList = function(req, res){
	var user_id = req.session.user._id;
	var user_firstname = req.session.user.firstname;
	var user_username = req.session.user.username;
	
	var msg_payload = {"user_id" : user_id, "user_firstname": user_firstname, "user_username" : user_username, "type": "followersList"};
	mq_client.make_request('showlist_queue',msg_payload, function(err,results){
		
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



exports.profilePage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to profile page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userProfilePage");
	} else {
		res.redirect('/loginPage');
	}
};

exports.profileupdate = function(req, res){
	var user_id= req.session.user._id;
	var firstname = req.param("firstname");
	var location = req.param("location");
	var phonenumber = req.param("phonenumber");
	
	var msg_payload = {"user_id": user_id, "firstname": firstname, "location": location, "phonenumber": phonenumber, 
			"type": "profileupdate"};
	mq_client.make_request('userprofile_queue',msg_payload, function(err,results){
		
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