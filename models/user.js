const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true, //doesn not enforce case in unique so apply lowercase
        required: [true, 'User email is required'],
        validate: {
            validator: function(email) {
                const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // validate real email...
                return re.test(email);
            },
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required']
    }
});
	
//On save hook, encrypt password
userSchema.pre('save', function(next){
	const user = this;

	bcrypt.genSalt(10, function(err, salt){
		if(err){ return next(err);}

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err){ return next(err);}

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(canidatePassword, cb){
    const user = this;
    bcrypt.compare(canidatePassword, user.password, function(err, isMatch){
      if(err){return cb(err, isMatch)};
      cb(null, isMatch);
    });
};


// create the model class
const ModelClass = mongoose.model('user', userSchema);

// export model
module.exports = ModelClass;