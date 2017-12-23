const User = require('../models/user');
const async = require('async');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
	const timestamp = new Date().getTime();
	// these are specific jwt propeties to encode token...
	//iat : issued at time
	// jwt.io
	// http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
	return jwt.encode({sub: user._id, iat: timestamp}, config.secret);
};

exports.signup = function(req, res, next) {
    const body = req.body;

    const user = new User({
        email: body.email,
        password: body.password,
    });

    // save to db
    // user has unique check so save will error out
    user.save(function(err) {
        if (err) {
        	return res.status(422).send(err);
        } else {
        	// send back auth token to make authenticated request -- JSON web token
        	// return res.json({token: tokenForUser(user)});
        	return res.json({token: tokenForUser(user)});
        };
    });
};

exports.signin = function(req, res, next) {
    // user is already auth so give them a token;
    // passports done passes user on the req object....
    res.send({token: tokenForUser(req.user)});

};