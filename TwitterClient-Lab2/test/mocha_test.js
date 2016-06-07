/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){


	it('signup page error if user signups with already existing username', function(done){
		request.post(
			    'http://localhost:3000/register',
			    { form: {"username":"test1","password":"test1","email":"test1@gmail.com","gender":"male","firstname":"test1firstname"
			    	,"lastname":"test1lastname","dob":"2/22/1991"} },
			    function (error, response, body) {
			    	assert.equal(401, JSON.parse(response.body).statusCode);
			    	done();
			    }
			);
	});

	it('signup page error if user signups with already existing email', function(done){
		request.post(
			    'http://localhost:3000/register',
			    { form: {"username":"test10","password":"test1","email":"test1@gmail.com","gender":"male","firstname":"test1firstname"
			    	,"lastname":"test1lastname","dob":"2/22/1991"} },
			    function (error, response, body) {
			    	assert.equal(401, JSON.parse(response.body).statusCode);
			    	done();
			    }
			);
	});
	
	it('login page error if user logins with unexisting email', function(done){
		request.post(
			    'http://localhost:3000/login',
			    { form: {"email":"test10@gmail.com","password":"test1"} },
			    function (error, response, body) {
			    	assert.equal(401, JSON.parse(response.body).statusCode);
			    	done();
			    }
			);
	});
	
	it('following page should be displayed after successfull login', function(done){
		request.post(
			    'http://localhost:3000/login',
			    { form: {"email":"test1@gmail.com","password":"test1"} },
			    function (error, response, body) {
					http.get('http://localhost:3000/followingPage', function(res) {
						assert.equal(200, JSON.parse(response.body).statusCode);
						
					});
			    	done();
			    }
			);
	});
	
	
	it('followers page should be displayed after successfull login', function(done){
		request.post(
			    'http://localhost:3000/login',
			    { form: {"email":"test1@gmail.com","password":"test1"} },
			    function (error, response, body) {
					http.get('http://localhost:3000/followersPage', function(res) {
						assert.equal(200, JSON.parse(response.body).statusCode);
					});
			    	done();
			    }
			);
	});
	
	
	it('follow page of given user using dynamic url should be displayed if user exists', function(done){
		request.post(
			    'http://localhost:3000/login',
			    { form: {"email":"test1@gmail.com","password":"test1"} },
			    function (error, response, body) {
					http.get('http://localhost:3000/followUserDetails', function(res) {
						assert.equal(200, JSON.parse(response.body).statusCode);
					});
			    	done();
			    }
			);
	});
});