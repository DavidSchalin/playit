module.exports = {
    ensureAuthenticated: function(req, res, next){
        // Check if the user is logged in
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/users/login');
    }
}