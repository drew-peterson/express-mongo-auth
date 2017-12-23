const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//interceptor/middle -- between incomming request and route below...
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false}); // local is a keyword for passport telling it to use the localStrategy saved in passport.js


module.exports = function(app){
	// if they go to '/' first if you want it required add requireAuth and if sucessfull cont to this route
	// need to supply valid token to require
	app.get('/', requireAuth, function(req,res){
		res.send({hi: 'there'});
	})
	app.post('/signup', Authentication.signup);
	app.post('/signin', requireSignin, Authentication.signin); // done cb will be passed to passport and called to continue to route.
};