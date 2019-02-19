var localStrategy = require('passport-local').Strategy;
const User = require('./models/user');


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
                    if (valid) {
                        // do not add password hash to session
                        done(null, {
                            username: doc.username,
                            id: doc._id
                        })
                    } else {
                        done(null, false, req.flash('message','Nombre de usuario o password incorrectos'))
                    }
                } else {
                    done(null, false)
                }
            }
        })
    }))
}