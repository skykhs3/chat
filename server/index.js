const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { Room } = require('./models/Room')
const { auth } = require('./middleware/auth')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

//사실 감춰야하는 사항
const mongoURI = "mongodb+srv://hyeonsu:abcd1234@cluster0.tfva0.mongodb.net/Cluster0?retryWrites=true&w=majority"

mongoose.connect(mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('몽고디비 연결 완료')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/api/users/findByID', (req, res) => {
  User.findById(req.body._id, (err, user) => {

    if (!user) {
      return res.json({
        success: false,
      })
    }
    else {
      return res.json({
        success: true,
        ...user._doc
      })
    }
  })

})
app.post('/api/users/register', (req, res) => {
  //Todo 중복 이메일 걸러내야함.
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})
app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "noUser"
      })
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "wrongPassword" })
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id })
      })
    })

  })
})
app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    email: req.user.email,
    nickname: req.user.nickname,
    token: req.token,
    onlineState: req.user.onlineState,
    joinedRoomID: req.user.joinedRoomID
  })
})
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({
    _id: req.user._id

  }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    })
  })
})
app.get('/api/axiostest', (req, res) => {
  res.send("axiostest 중입니다.")
})
app.post('/api/users/createRoom', (req, res) => {
  const room = new Room(req.body)
  room.save((err, roomInfo) => {
    if (err) return res.json({ success: false, err })
    else {

      User.findByIdAndUpdate(
        req.body.adminID
        , { onlineState: 3, joinedRoomID: roomInfo._id }, (err, user) => {
          if (err) {
            return res.json({ success: false, err })
          }

          return res.status(200).json({
            success: true
          })
        })
    }
  })
})
app.post('/api/users/changeOnlineState', (req, res) => {
  console.log(req.body._id)
  User.findByIdAndUpdate(
    req.body._id
    , { onlineState: req.body.onlineState, joinedRoomID: req.body.joinedRoomID }, (err, user) => {
      console.log(user)
      if (err) return res.json({ succes: false, err })
      res.status(200).json({
        success: true,
      })
    })
})
// app.get('/api/users/auth',auth,(req,res)=>{
//   res.status(200).json({
//     _id:req.user.id,
//     email:req.user.email,
//     nickname:req.user.nickname,

//     token:req.token,
//     onlineState: req.onlineState
//   })
// })

///만료된 방인가?
app.post('/api/rooms/auth', (req, res) => {
  Room.findById(req.body._id, (err, roomInfo) => {
    if (err) return res.json({ isAuth: false, ...roomInfo._doc })
    else if (roomInfo._doc.isDeleted === true) {
      return res.json({ isAuth: false, ...roomInfo._doc })
    }
    else {
      return res.json({ isAuth: true, ...roomInfo._doc })
    }
  })
})
app.get('/api/rooms/loadList', (req, res) => {
  Room.find({}, (err, docs) => {
    return res.json({
      docs: docs,
    })
  })
});
app.post('/api/rooms/joinRoom', (req, res) => {
  Room.findById(req.body._id, (err, room) => {

    if (!room) {
      return res.json({
        success: false,
        message: "noRoom"
      })
    }
    else {
      //Todo 터치 못하게 막는 화면 필
      if (room._doc.isDeleted === false && room._doc.participantID === "" && room._doc.adminID !== req.body.userInfo._id) {

        Room.findByIdAndUpdate(req.body._id,
          { participantID: req.body.userInfo._id, participantNickname: req.body.userInfo.nickname }, (err, room) => {
            return res.json({
              success: true,
            })
          })
      }
      else {
        return res.json({
          success: false,
          message: "본인이 만든방"
        })
      }
    }
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))