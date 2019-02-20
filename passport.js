var localStrategy = require('passport-local').Strategy;
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
                            id: doc._id
                        })
                    } else {
                        var failsAttempts = doc.failsAttempts + 1;

                        if(failsAttempts < 3 && !doc.isBlocked){
                            doc.set({failsAttempts}).save();
                            done(null, false, req.flash('message','Nombre de usuario o password incorrectos'));
                        }
                        else{
                            doc.set({failsAttempts, 'isBlocked': true}).save();
                            done(null, false, req.flash('message',  'El usuario ha sido bloquedo, maximo de intentos alcanzado'));
                            var notification = new Notification();
                            notification.message = 'El usuario ha sido bloquedo, maximo de intentos alcanzado';
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
}