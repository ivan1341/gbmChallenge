const JWT = require('jsonwebtoken');
const User = require('../models/user');
const {JWT_SECRET} = require('../configuration');

signToken = user =>{
    return JWT.sign({
        iss:'ivanflores',
        sub: user.id,
        iat: new Date().getDate(),
        exp: new Date().setDate(new Date().getDate() + 1) //Expira en un día
    }, JWT_SECRET);
}

module.exports = {
    signUp: async(req, res, next) => {
        //Email and password
        console.log('conten of req.value.body', req.value.body);
        console.log('UsersControllers.signUp() Called!');
      

        const {email, password } = req.value.body;

//checar si un usuario tiene un email
        const foundUser = await User.findOne({email});
        if(foundUser){
            res.status(403).json({error:'El email ya está en uso'})
        }

//crear un nuevo usuario
        const newUser = new User({ email, password })
        newUser.save();

        //res.json({user : 'created'});
     
        //generar token
        const token = signToken(newUser);


        //responder con el token

        res.status(200).json({token})
    },
    signIn: async(req, res, next) => {
        // Generate token
        console.log('UsersControllers.signIn() Called!');
    },
    secret: async(req, res, next) => {
        console.log('UsersControllers.secret() Called!');
    }
}