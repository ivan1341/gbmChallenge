const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.connect('mongodb://localhost/APIauthentication',{ useNewUrlParser: true })

const app = express();


app.use(session({
    secret: 'keyboardcat'
  }));

app.use(express.static('web'));
//Middlewares
app.use(passport.session());
app.use(passport.initialize());

app.use(morgan('dev'));
app.use(bodyParser.json());
//Routes
app.use('/', require('./routes/users'))
//app.use('/users', require('./routes/users'))
//Star ther server
const port = process.env.PORT || 3000;

app.listen(port);
console.log(`Servidor escuchando en el puerto ${port}`);