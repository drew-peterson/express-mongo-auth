const passport = require('passport');
const User = require('../models/user');
const config = require('../config');


// create local strategry
const LocalStrategy = require('passport-local'); // try to auth user w/ email and password only --> sends back token to use in future
const localOptions = {
	usernameField: 'email' // default looks for username field but we use email field so specific it here
}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
	// verify this username and passowrd is correct
	User.findOne({email: email}, function(err, user){
		if(err){return done(err, false)};
		if(!user){return done(err, false)};

		// compare passwords -- user is returned w/ method and info...
		user.comparePassword(password, function(err, isMatched){
			if(err){return done(err);};
			if(!isMatched){return done(null, false)};

			return done(null, user);
		});
	});
});

// strategy method for authenticating a user -- different ones on passport for facebook,google, username/passwword etc....
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// setup options for jwt strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'), // tells where to look for jwt on request header -- in post man you make a new header with key of authorization and value of token
	secretOrKey: config.secret, // need to decrypt token
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	// see if the user ID in the payload exists in out DB
	// if it doesnt call 'done' w/ that user else call done without user object.
	User.findById(payload.sub, function(err, user){
		if(err){return done(err, false);};

		if(user){
			done(null, user);
		}else{
			done(null, false);
		};
	});
});

// test passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);


