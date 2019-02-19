const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost/APIauthentication',{ useNewUrlParser: true })


passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

const app = express();


app.use(session({
    secret: 'keyboardcat'
  }));

app.use(express.static('web'));
//Middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
//Routes
app.use('/', require('./routes/users'))
//app.use('/users', require('./routes/users'))
//Star ther server
const port = process.env.PORT || 3000;

app.listen(port);
console.log(`Servidor escuchando en el puerto ${port}`);