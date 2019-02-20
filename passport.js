const localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/user');
const Notification = require('./models/notification');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user)
    })
    passport.deserializeUser(function (user, done) {
        done(null, user)
    })

    passport.use(new localStrategy({passReqToCallback : true}, function (req, username, password, done) {
        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                done(err)
            } else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password)
                    if (valid && !doc.isBlocked) {
                        // do not add password hash to session
                        done(null, {
                            username: doc.username,
                            id: doc._id,
                            isAdmin:doc.isAdmin
                        })
                    } else {
                        var failsAttempts = doc.failsAttempts + 1;

                        if(failsAttempts < 3 && !doc.isBlocked){
                            doc.set({failsAttempts}).save();
                            done(null, false, req.flash('message','Nombre de usuario o password incorrectos'));
                        }
                        else{
                            doc.set({failsAttempts, 'isBlocked': true}).save();
                            done(null, false, req.flash('message',  'El usuario ' +username+ ' ha sido bloquedo, maximo de intentos alcanzado'));
                            var notification = new Notification();
                            notification.message = 'El usuario ' +username+ ' ha sido bloquedo, maximo de intentos alcanzado';
                            notification.save(function (err, user) {
                                if (err) {
                                    console.log('db error')
                                } else {
                                    console.log('notificacion añadida')
                                }
                            })
                        }
                    }
                } else {
                    done(null, false,req.flash('message','Nombre de usuario o password incorrectos'))
                }
            }
        })
    }))

    passport.use(new FacebookStrategy({
        clientID: "2332996226929990",
        clientSecret: "4f23be50fb6b9f588e517021c386bde8",
        callbackURL: "https://localhost:3000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        var user = User();
        user.username = profile.displayName;
        user.passport = "";
          done(null, user);
      }
    ));
}



