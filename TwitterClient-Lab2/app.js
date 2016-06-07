var express = require('express')
  , http = require('http')
  , path = require('path')
  , site = require('./routes/site')
, registerModule = require('./routes/registerModule')
, loginModule = require('./routes/loginModule')
, tweetModule = require('./routes/tweetModule')
, followerModule = require('./routes/followerModule')
, userModule = require('./routes/userModule')
, mongo = require('./routes/mongo');
var mongoSessionConnectURL = "mongodb://localhost:27017/twittertest";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());




app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function checkUserSession(req, res, next) {
	if (!req.session.user) {
		res.redirect('/loginPage');
		return;
	}
	next();
};


app.get('/', site.sitePage);
app.get('/signupPage', site.signupPage);
app.get('/loginPage', site.loginPage);
app.post('/register', registerModule.register);
app.get('/homepage',loginModule.redirectToHomepage);
app.post('/login', loginModule.login);
app.post('/tweet', checkUserSession, tweetModule.tweet);
app.get('/loginPagetweets', checkUserSession, tweetModule.showtweets);
app.get('/logout', loginModule.logout);
app.get('/user/:user', checkUserSession, followerModule.followUserMainPage);
app.get('/followUser', checkUserSession, followerModule.followUser);
app.get('/followUserDetails', checkUserSession, followerModule.followUserDetails);
app.post('/hashTagtweets', checkUserSession, tweetModule.hashtagtweets);
app.post('/retweet', checkUserSession, tweetModule.retweet);
app.get('/followingPage', checkUserSession, userModule.followingPage);
app.get('/followingList', checkUserSession, userModule.followingList);
app.get('/followersPage', checkUserSession, userModule.followersPage);
app.get('/followersList', checkUserSession, userModule.followersList);
app.get('/userprofilePage', checkUserSession, userModule.profilePage);
app.post('/profilechanges', checkUserSession, userModule.profileupdate);


	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  

