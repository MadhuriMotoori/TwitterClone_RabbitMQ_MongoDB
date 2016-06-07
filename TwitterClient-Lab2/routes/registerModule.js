var mq_client = require('../rpc/client');

function register(req, res){
	var username = req.param("username");
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var gender = req.param("gender");
	var dob = req.param("dob"); 
	
	var msg_payload = {"username" : username, "email": email, "password": password, "firstname": firstname,
			"lastname": lastname, "gender": gender, "dob": dob};
	mq_client.make_request('registration_queue',msg_payload, function(err,results){
		
		console.log("the results are:" + JSON.stringify(results));
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 200){
				req.session.user=results.results;
			}
			
			
			res.send(results);
		}  
	});
}

exports.register=register;