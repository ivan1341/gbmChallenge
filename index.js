const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/APIauthentication',{ useNewUrlParser: true })

const app = express();

app.use(express.static('web'));
//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
//Routes
app.use('/users', require('./routes/users'))
//Star ther server
const port = process.env.PORT || 3000;

app.listen(port);
console.log(`Servidor escuchando en el puerto ${port}`);