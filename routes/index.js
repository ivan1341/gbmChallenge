var express = require('express');
var passport = require('passport');
var router = express.Router();
const User = require('../models/user');
const Notification = require('../models/notification');
const https = require('https');
const request = require('request');

var currentUser = null;
var loggedin = function (req, res, next) {
  
  if (req.isAuthenticated()) {
    currentUser = req.user;
    next()
  } else {
    res.redirect('/login')
  }
}

var admin = function (req, res, next) {
    console.log(req.user.isAdmin)
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }

/* GET home page. */
router.get('/', loggedin, function (req, res, next) {
  res.render('index', {
    user: currentUser
  });
});


router.get('/login', function (req, res, next) {
    res.render('login',{ messages: req.flash('message') });
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});


router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

router.get('/users',loggedin, function (req, res) {
  User.find({},  function (err, doc) {
    console.log(doc);
    res.render('users', { users: doc, user:currentUser });
  })
})

router.get('/notifications',loggedin, function (req, res) {
    Notification.find({ }).sort({date: -1}).exec(  function (err, doc) {
    console.log(doc);
    res.render('notifications', { messages: doc, user:currentUser });
  })
})

router.get('/getIPC', function (req, res) {

        request('https://www.gbm.com.mx/Mercados/ObtenerDatosGrafico?empresa=IPC', (err, response, body) => {
            if (err) { return console.log(err); }
            res.send(body);
        
          });
})

    router.post('/userOperations', function (req, res) {
        var body = req.body,
            username = body.username,
            isAdmin = body.isAdmin;
            isBlocked = body.isBlocked;
            operation = body.operation;

        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                res.send('Ha ocurrido un error')
            } else {

              switch(operation){
                case "save":
                  doc.set({ isAdmin, isBlocked }).save(result)
                break;

                case "reset":
                    doc.set({ isAdmin:false, isBlocked:false, failsAttempts:0}).save(result)
                break;
                case "delete":
                    doc.remove(result);
                break
              }
                    function result(err, user) {
                      if (err) {
                          res.send('Error en la base de datos')
                      } else {
                          res.send('Operación '+ operation+ ' exitosa')
                      }
                  }
            }
        })
    });


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

module.exports = router;