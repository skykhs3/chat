const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nickName :{
        type : String,
        maxlength: 50,
    },
    email:{
        type : String,
        trim: true,
    },
    password:{
        type: String,
        minlength: 5,
    },
    onlineState:{
        type: Number,
        default: 0,
        /*
        0 : 로그아웃 상태
        1 : 방리스트 보는중
        2 : 방 만드는중
        3 : 게임 대기중 + 게임 하는중
        */
    }
})
const User = mongoose.model('User',userSchema)

module.exports={User}