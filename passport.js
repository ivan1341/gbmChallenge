const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Local Strategy

passport.use(new LocalStrategy(
    function(email, password, done) {
console.log('sdfsdf')
  
      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));