var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Notification = require('../models/notification');

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', loggedin, function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/login', function (req, res, next) {
 

    res.render('login',{ messages: req.flash('message') });
  
});


router.get('/signup', function (req, res, next) {
  res.render('signup');
});


router.get('/profile', loggedin, function (req, res, next) {
  res.render('profile', {
    user: req.user
  })
});


router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

router.get('/blocked', function (req, res) {
  res.render('blocked');
})

router.get('/users', function (req, res) {
  User.find({},  function (err, doc) {
    console.log(doc);
    res.render('users', { users: doc });
  })
  

  
})

module.exports = router;