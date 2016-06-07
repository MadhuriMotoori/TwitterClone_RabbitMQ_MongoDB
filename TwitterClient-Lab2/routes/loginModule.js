var ejs = require("ejs");
var mq_client = require('../rpc/client');
//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	if(req.session.user) {
		console.log("User entered to home page");
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("userMainPage");
		//res.redirect('/loginPagetweets');
	} else {
		res.redirect('/loginPage');
	}
};



function login(req, res){	
	var email = req.param("email");
	var password = req.param("password");
	
	var msg_payload = {"email": email, "password": password};	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 200){
				req.session.user=results.results;
			}
			console.log("error" + results.error)
			res.send(results);
		}  
	});
}

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/loginPage');
};

exports.login=login;
