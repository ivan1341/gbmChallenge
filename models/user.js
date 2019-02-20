const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

var schema = mongoose.Schema;

var userSchema = new schema({
    username:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: { type: Boolean,
         default: false
         },
    failsAttempts : {
        type: Number,
        default: 0
    },
    isBlocked : {
        type: Boolean,
        default: false
    }
    
})

userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password,hash) {
    return bcrypt.compareSync(password,hash)
}

module.exports = mongoose.model('users',userSchema,'users');