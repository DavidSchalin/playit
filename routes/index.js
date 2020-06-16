

var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  // req.user will return true if user is logged in
  res.render('index', {loggedIn: req.user});
});

/* GET about page */
router.get('/about', function (req, res, next) {
  res.render('about', {loggedIn: req.user});
});

/* GET 'jag har aldrig' page */
router.get('/jagharaldrig', function(req, res){
  res.render('jagharaldrig', {loggedIn: req.user});
});

/* GET 'pekleken' page */
router.get('/pekleken', function(req, res) {
  res.render('pekleken', { loggedIn: req.user});
});

/* GET 'sanning/konka' page */
router.get('/sanningkonka', function(req, res){
  res.render('sanningkonka', {loggedIn: req.user});
});


module.exports = router;
