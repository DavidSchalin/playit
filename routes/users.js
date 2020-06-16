var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var { ensureAuthenticated } = require('../config/off');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// User model
const User = require('../models/User');





/* EXTRA UTIL FUNCTIONS */

/*
Save a new game util func
Searches for a user with the given email, then it pushes the new game to the games array.
It doesnt need to do anything in the body of the error,result function except throw an error if necessary
as the game is already given in the parameter */
function saveNewGame(req, game){
    User.findOneAndUpdate({email: req.user.email}, {$push: {games: game}}, {returnNewDocument: true}, (error, result) => {
        if(error){
            throw error;
        } else {
            return true;
        }
    });
}





/* Register Handle */
/* Used when registering a new account */
router.post('/register', function (req, res, next) {

    // Get user credentials from register form
    const { username, email, password } = req.body;

    // Check if user already exists
    User.findOne( { email: email} )
        .then(user => {
            if(user) {
                // User exists
                req.flash('error_msg', 'Denna mailadress är redan kopplad till ett konto.');
                res.redirect('/users/register');
            } else {
                // User does not exist, create a new user
                const newUser = new User({
                    username: username,
                    email: email,
                    password: password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set password to hashed password
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            // To include a 'success_msg' to /users/login when redirecting we must use flash
                            // because we're redirecting from an initial post request
                            req.flash('success_msg', 'Registreringen lyckades! Du kan nu logga in på ditt nya konto.');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }));
            }
        });

});

/* Login Handle */
/* Used when logging in */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        //If the user has entered the correct email and password redirect to the dashboard otherwise stay on the same page
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

/* Logout Handle */
/* Used when logging out */
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

/* Save Game Handle */
/* Used when pressing the save new game */
router.post('/save', (req, res) => {
    // Check if user is logged in
    if(req.user){
        //The game variable consists of the requests gamename, its preparations and its rules.
        let game = {name: req.body.gameName, preps: req.body.prep, rules: req.body.rule};

        //Call saveNewGame with the game variable and the request which holds the user then redirect to the dashboard
        saveNewGame(req, game);
        res.redirect('/users/dashboard');
    } else {
        //If the user is not logged in then respond with a 404
        res.status(404)
            .send('Du måste vara inloggad för att göra detta');
    }
});

/* Change password handle */
/* Used for changing the users password */
router.post('/psw', (req, res, next) => {
    //Save the entered email, username and password of the user
    const {email, username, password} = req.body;

    //Find a user with the given email and username
    User.findOne( {email: email, username: username} )
        .then(user => {
            //Set the users password to the new one
            user.password = password;
            // Hash password
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(user.password, salt, (err, hash) => {
                    // Set password to hashed password
                    user.password = hash;
                    // Save user
                    user.save()
                        .then(user => {
                            res.redirect('/users/dashboard');
                        })
                        .catch(err => console.log(err));
                }));

        });
});

/* GET password page */
router.get('/psw', function(req, res, next) {
    res.render('psw', {
        loggedIn: req.user,
        username: req.user.username,
        email: req.user.email,
    });
});


/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login', {loggedIn: req.user});
});

/* GET register page */
router.get('/register', function(req, res, next) {
    res.render('register', {loggedIn: req.user});
});

/* GET dashboard page */
/* Used for creating the my-games table in the dashboard */
router.get('/dashboard', ensureAuthenticated, function(req, res, next){
    //Create an array for the games that the user has
    //Consists of objects that hold the name of the games and their id
    let allGames = [];

    //Promise is used to ensure that the code runs in the correct order
    const promise1 = new Promise((resolve, reject) => {
        resolve(User.findOne({email: req.user.email}, (error, result) => {
            if(error){
                throw error;
            } else {
                //Loop over the games that the user has and push their names and ids to the allGames array
                result.games.forEach(function (game) {
                    allGames.push({
                        gameName: game.name,
                        gameId: game._id
                    })
                });
            }
        }));
    });

    //Once the allGames array is filled render the dashboard
    promise1.then((value => {
        res.render('dashboard', {
            username: req.user.username,
            loggedIn: req.user,
            games: allGames,
        });
    }));
});

/* GET user saved game */
/* used for opening a certain game from the dashboard */
router.get('/:gameID', (req, res) => {
    let gameID = req.params.gameID;
    let gameType = "";
    let BreakException = {};    // Used as a "break;" function

    // Get the user and the requested game
    User.findOne({email: req.user.email})
        .then(user => {
            // found a user..
            let allGames = user.games;
            let allGamesIndex = 0;
            allGames.forEach(function(game){
                if(game._id == gameID){
                    res.render('existinggame', {
                        loggedIn: req.user,
                        existingGame: true,
                        gameName: game.name,
                        gamePreps: game.preps,
                        gameRules: game.rules,
                        gameID: gameID
                    });
                    throw BreakException;   // 'break;'
                }
                allGamesIndex += 1;
            });
        })
        .catch(error => {
            res.status(404);
        });
});


/* POST user updated game */
/* Used when the user has chosen to save the game by either saving it as a new one or deleting it */
router.post('/update/:gameid/:button?', (req, res) => {

    let gameid = req.params.gameid;
    let game = {name: req.body.gameName, preps: req.body.prep, rules: req.body.rule};

    //If the user clicked remove the game
    if(req.params.button === "remove-game"){
        //The promise is used to ensure that the redirect to dashboard is sent after the game is removed
        //The findOneAndUpdate will pull the given game's id from the games array thus removing it from the database
        //It finds the user and and array called games which consists of only the game in question

        const promise2 = new Promise((resolve, reject) => {
            resolve(User.findOneAndUpdate({
                email: req.user.email,
                games: {$elemMatch: {_id: gameid}}
            }, {$pull: {games: {_id: gameid}}}, {returnNewDocument: true}, (error, result) => {
                if (error) {
                    throw error;
                } else {
                    console.log(result);
                }
            }));
        });
        promise2.then((value => {
            //once done redirect to the dashboard
            res.redirect('/users/dashboard');
        }));

    } else {
        // If the user clicked save as a new game
        if (req.params.button == "save-new") {
            if (!game.preps || !game.rules) {
                // Preps or rules have not been updated -> use the same preps/rules from "parent" game
                User.findOne({email: req.user.email, "games._id": gameid}, {"games.$": 1})
                    .then(item => {
                        // item is an object containing the user and its ONE game that matches the gameid
                        // games is still an array and the game object is accessed by games[0].
                        // Check which of preps or rules (or both) that should be changed
                        if (!game.preps) {
                            game.preps = item.games[0].preps;
                        }
                        if (!game.rules) {
                            game.rules = item.games[0].rules;
                        }
                        saveNewGame(req, game);
                    });
            } else {
                saveNewGame(req, game);
            }
            return res.redirect('/users/dashboard');    // return to stop code below from executing
        }

        let update = {};
        if (game.preps) {
            update["games.$.preps"] = game.preps;
        }
        if (game.rules) {
            update["games.$.rules"] = game.rules;
        }

        User.findOneAndUpdate({
            email: req.user.email,
            games: {$elemMatch: {_id: gameid}}
        }, update, {returnNewDocument: true}, (error, result) => {
            if (error) {
                throw error;
            } else {
                res.redirect('/users/dashboard');
            }
        });
    };

});




module.exports = router;