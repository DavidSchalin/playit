const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match user
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        // Could not find a user that matched the criteria
                        return done(null, false, { message: 'Det finns inget konto kopplat till denna mailadress' });
                    }

                    // Found a user that matched the criteria, now check is passwords match
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            // Password matched
                            return done(null, user);
                        } else {
                            // Password did not match
                            return done(null, false, { message: 'Felaktigt lösenord' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // This is the initial stage to store users in a session cookie
    // so that users can stay logged in during their entire session.
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    // Deserialize handles fetching of a user from a current session. Used in request handling.
    // Stores the user in req.user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
}