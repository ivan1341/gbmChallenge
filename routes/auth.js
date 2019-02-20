var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */


module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        var body = req.body,
            username = body.username,
            password = body.password;
            rol = body.rol;
        User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                res.status(500).send('Ha ocurrido un error')
            } else {
                if (doc) {
                    res.status(500).send('El nombre de usuario ya existe')
                } else {
                    var record = new User()
                    record.username = username;
                    record.password = record.hashPassword(password);
                    record.isAdmin = (rol == 'admin')? true:false;
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send('db error')
                        } else {
                            res.send('registro exitoso')
                        }
                    })
                }
            }
        })
    });


    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true
    }), function (req, res) {
        res.send('hey')
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
                    doc.set( ).save(function (err, user) {
                        if (err) {
                            res.send('Error en la base de datos')
                        } else {
                            res.send('registro exitoso')
                        }
                    })
                
            }
        })
    });


    return router;
};