const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomTitle:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default: false,
    },
    adminID:{
        type:String,
    },
    adminNickname:{
        type:String,
    },
    participantID:{
        type:String,
        default:"",
    },
    participantNickname:{
        type:String,
        default:"",
    },
})
const Room=mongoose.model('Room',roomSchema);
module.exports={Room}