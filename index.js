const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const path = require('path');
const flash = require('connect-flash');
const config = require('./configuration');

require('./passport')(passport)

mongoose.connect('mongodb://localhost/' + config.DATABASE_NAME ,{ useNewUrlParser: true })


var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth')(passport);



const app = express();
// view engine setup
app.set('views', './views'); 
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.static('public'));
//Middlewares


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'thesecret',
    saveUninitialized: false,
    resave: false
  }))

app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth)

//app.use('/users', require('./routes/users'))


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log();
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

//Star ther server
const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Servidor escuchando en el puerto ${port}`);