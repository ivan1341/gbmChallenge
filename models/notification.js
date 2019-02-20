const mongoose = require('mongoose')

var schema = mongoose.Schema;

var notificationSchema = new schema({
    message:{
        type:String,
        required:true
    },
    isReaded: {
        type: Boolean,
        default:false,
        required: true
    },
    date:{
        type:Date,
        default:Date.now,
        required: true
    }

})

notificationSchema.methods.setReaded = function (doc) {
    doc.set({isReaded:true}).save();
}


module.exports = mongoose.model('usnotification',notificationSchema,'usnotifications');