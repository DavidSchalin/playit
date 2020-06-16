const mongoose = require('mongoose');

/* This is the User model
*
*  It models the database entries/documents, i.e. what fields every entry should contain
*  and what type of data should be stored in these fields.
*
* */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    games: [{
        name: String,
        preps: [String],
        rules: [String]
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;