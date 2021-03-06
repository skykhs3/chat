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
    whoseTurn:{
        type:Number,
        default:1,
    },
    isStart:{
        type:Boolean,
        default:false,
    },
    isReady:{
        type:Boolean,
        default:false,
    },
    timeLimit:{
        type:Date,
    },
    winner:{
        type:Number,
        default:0,
    },
    whoFirst:{
        type:Number,
        default:1,
    },
    gameHistory:{
        type:Array,
        'default':[]
    },
    ansHistory:{
        type:Array,
        'default':[]
    }
    
})
const Room=mongoose.model('Room',roomSchema);
module.exports={Room}