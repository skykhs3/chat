const mongoose = require('mongoose');
const jwt =require('jsonwebtoken')

const userSchema = mongoose.Schema({
    
    nickname :{
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
    },
    joinedRoomID:{
        type:String,
    },
    token:{
        type:String
    }
    
})
userSchema.methods.comparePassword = function(plainPassword,cb){
    if(plainPassword!== this.password){
        return cb(null,false)
    }
    return cb(null,true)
}
userSchema.methods.generateToken = function(cb){
    var user=this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token=jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)

    })

}
userSchema.statics.findByToken = function(token,cb){
    var user=this;
    jwt.verify(token,'secretToken',function(err,decoded){
        user.findOne({
            "_id":decoded,"token":token
        },function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User',userSchema)
module.exports={User}