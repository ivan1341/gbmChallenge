const express = require('express');
const router = require('express-promise-router')();
const {validateBody, schemas} = require('../helpers/routeHelpers')
const UsersController = require('../controllers/users');

router.route('*')
    .get(function(req,res){
        res.redirect("/login.html")
    }, UsersController.signUp);



router.route('/signup')
    .post(validateBody(schemas.authSchema), UsersController.signUp);
    

router.route('/signin')
    .post(UsersController.signIn);

router.route('/secret')
    .get(function(req,res){
        res.redirect("/login.html")
    },UsersController.secret);

module.exports = router;