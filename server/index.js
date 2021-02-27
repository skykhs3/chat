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
var timeLimitMap = new Map()
var testArray = [];
var gameIntervalTime = 10000;

//사실 감춰야하는 사항
const mongoURI = "mongodb+srv://hyeonsu:abcd1234@cluster0.tfva0.mongodb.net/Cluster0?retryWrites=true&w=majority"

mongoose.connect(mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('몽고디비 연결 완료')).catch(err => console.log(err))

// socket
var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.io = require('socket.io').listen(server)
app.io.on('connection', socket => {
  console.log("connection");
  socket.on('test', item => {
    console.log(item);

  })
})

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
var num = 0;
app.get('/api/axiostest', (req, res) => {
  app.io.emit("/socket/rooms/endTime", "server->client");
  //   console.log(`start ${++num}`)
  //   const tt=num;
  //   setTimeout(()=>{console.log(`end ${tt}`)
  // res.json({});
  // },5000);
  res.json({ err: 1 });
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
          app.io.emit("/sToC/rooms/needToRefresh",);
          return res.status(200).json({
            success: true
          })
        })
    }
  })
})
app.post('/api/users/changeOnlineState', (req, res) => {
  //console.log(`_id ${req.body._id}`)
  User.findByIdAndUpdate(
    req.body._id
    , { onlineState: req.body.onlineState, joinedRoomID: req.body.joinedRoomID }, (err, user) => {
      if (err) return res.json({ success: false, err })
      res.status(200).json({
        success: true,
        ...user._doc,
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
app.post('/api/rooms/startgame', (req, res) => {
  ///_id : roomID
  Room.findById(req.body._id, async (err, room) => {
    if (err) return res.json({ success: false, message: "err" })
    if (room.isDeleted === true) return res.json({ success: false, message: "room deleted" })
    if (room.isStart === true) return res.json({ success: false, message: "already start" })
    if (room.isReady === false) return res.json({ success: false, message: "not ready" })

    //must undo
    // if(room.isStart===true) return res.json({success:false,message:"already start"})

    if (room.participantID === "") return res.json({ success: false, message: "no participant" })
    room.isStart = true;
    room.whoseTurn = 1;
    room.whoFirst = 1;

    room.timeLimit = new Date(new Date().getTime() + gameIntervalTime);
    await room.save((err, updatedRoom) => {
      if (err) return res.json({ success: false, message: "err" })
      timeLimitMap.set(room._doc._id, updatedRoom.timeLimit);
      testArray.push(updatedRoom.timeLimit)
      app.io.emit("/sToC/rooms/needToRefresh",);
      res.json({ success: true });
    })


  })
})
app.post('/api/rooms/readygame', (req, res) => {
  Room.findById(req.body._id, async (err, room) => {
    if (err) return res.json({ success: false, message: "err" })
    if (room.isDeleted === true) return res.json({ success: false, message: "room deleted" })
    if (room.isStart === true) return res.json({ success: false, message: "already start" })
    console.log(req.body.isReady);
    if (req.body.isReady === true) {
      room.isReady = false;
    }
    else {
      room.isReady = true;
    }
    console.log(room.isReady)
    await room.save((err, updatedRoom) => {
      if (err) {
        return res.json({ success: false, message: "err" })
      }
      console.log(updatedRoom._doc)
      app.io.emit("/sToC/rooms/needToRefresh",);
      res.json({ success: true });
    })

  })
})
app.post('/api/rooms/exitGameRoom', (req, res) => {
  // {
  //   adminID:
  //    participantID:
  //   roomID:
  //    isAdmin:
  // }
  Room.findById(req.body.roomID, (err, room) => {
    if (err) return res.json({ success: false });
    if(room.isStart===true && room.winner===true){
      return res.json({success:false})
    }
    room.isReady = false;
    if (req.body.isAdmin === true) {
      User.findById(req.body.adminID, (err, admin) => {
        if (err) return res.json({ success: false });
        if (room.participantID !== "") {
          room.adminID = room.participantID;
          room.adminNickname = room.participantNickname;
          room.participantID = "";
          room.participantNickname = "";
        }
        else {
          room.isDeleted = true;
        }
        admin.joinedRoomID = "";
        admin.onlineState = 1;
        ///admin, room 저장
        room.save((err,updatedRoom)=>{
          if(err) return res.json({ success: false });
          admin.save((err,updatedUser)=>{
            if(err) return res.json({ success: false });
            app.io.emit("/sToC/rooms/needToRefresh",);
            res.json({success:true})
          })
        })

      })
    }
    else {
      console.log("parti"+req.body.participantID)
      User.findById(req.body.participantID,(err,participant)=>{
        if(err) return res.json({success:false})
        console.log(participant)
        room.participantID = "";
        room.participantNickname = "";
        participant.joinedRoomID = "";
        participant.onlineState = 1;
        room.save((err,updatedRoom)=>{
          if(err)return res.json({ success: false });
          participant.save((err,updatedUser)=>{
            if(err) return res.json({ success: false });
            app.io.emit("/sToC/rooms/needToRefresh",);
            res.json({success:true})
          })
        })
      })
    }

  })


})


//자기 턴이 지났는지 안지났는지 확인
playAlert = setInterval(function () {
  timeLimitMap.forEach((value, key, map) => {
    if (value.getTime() < new Date().getTime()) {
      Room.findById(key, (err, room) => {
        if (room.winner === 0) {
          room.winner = 3 - room.whoseTurn
          app.io.emit("/sToC/rooms/needToRefresh",);
        }
        room.save((err, updatedRoom) => { });
      })
    }
  })
}, 200);

//돌을 놓았을 때, 위치, 차례 등등-> 겜 끝났는지 판단.
app.post('/api/users/didTurn', (req, res) => {

  // {
  //   _id :  룸번호
  //   isAdmin:  어드민인가?
  //   position:돌을 둔 위치 : Number,
  // }
  Room.findById(req.body._id, async (err, room) => {
    if (err) return res.json({ success: false, message: "err" })
    for (var i = 0; i < room.gameHistory.length; i++) {
      if (room.gameHistory[i] === req.body.position) {
        return res.json({ success: false, message: "same position" })
      }
    }
    if (room.isStart === false) {
      return res.json({ success: false, message: "game not start" })
    }
    else if (room.winner !== 0) {
      return res.json({ success: false, message: "game is finish" })
    }
    else if (req.body.isAdmin !== room.whoseTurn) {
      return res.json({ success: false, message: "not your turn" })
    }

    else {
      room.gameHistory.push(req.body.position);
      var checkAdmin = [];
      var checkParticipant = [];
      var cntAdmin = 0;
      var cntParticipant = 0;
      for (var i = 0; i < 9; i++) {
        checkAdmin.push(false);
        checkParticipant.push(false);
      }
      for (var i = 0; i < room.gameHistory.length; i++) {
        if (i % 2 == 0) {
          if (room.whoFirst == 1) {
            checkAdmin[room.gameHistory[i]] = true;
          }
          else {
            checkParticipant[room.gameHistory[i]] = true;
          }
        }
        else {
          if (room.whoFirst == 2) {
            checkAdmin[room.gameHistory[i]] = true;
          }
          else {
            checkParticipant[room.gameHistory[i]] = true;
          }
        }
      }


      for (var i = 0; i <= 6; i += 3) {
        cntAdmin = 0;
        cntParticipant = 0;
        for (var j = i; j <= i + 2; j++) {
          if (checkAdmin[j] === true) {
            cntAdmin++;
          }
          if (checkParticipant[j] === true) {
            cntParticipant++;
          }
        }
        if (cntAdmin == 3) {
          room.winner = 1;
        }
        if (cntParticipant == 3) {
          room.winner = 2;
        }
      }



      for (var i = 0; i <= 2; i++) {
        cntAdmin = 0;
        cntParticipant = 0;
        for (var j = i; j <= i + 6; j += 3) {
          if (checkAdmin[j] === true) {
            cntAdmin++;
          }
          if (checkParticipant[j] === true) {
            cntParticipant++;
          }
        }
        if (cntAdmin == 3) {
          room.winner = 1;
        }
        if (cntParticipant == 3) {
          room.winner = 2;
        }
      }


      cntAdmin = 0;
      cntParticipant = 0;
      for (var j = 0; j <= 8; j += 4) {
        if (checkAdmin[j] === true) {
          cntAdmin++;
        }
        if (checkParticipant[j] === true) {
          cntParticipant++;
        }
      }

      if (cntAdmin == 3) {
        room.winner = 1;
      }
      if (cntParticipant == 3) {
        room.winner = 2;
      }

      cntAdmin = 0;
      cntParticipant = 0;
      for (var j = 2; j <= 6; j += 2) {
        if (checkAdmin[j] === true) {
          cntAdmin++;
        }
        if (checkParticipant[j] === true) {
          cntParticipant++;
        }
      }

      if (cntAdmin == 3) {
        room.winner = 1;
      }
      if (cntParticipant == 3) {
        room.winner = 2;
      }
      if (room.gameHistory.length === 9 && room.winner === 0) {
        room.winner = 3;
      }

      room.timeLimit = new Date(new Date().getTime() + gameIntervalTime);
      room.whoseTurn = 3 - room.whoseTurn
      await room.save((err, updatedRoom) => {
        if (err) return res.json({ success: false, message: "err" })
        timeLimitMap.set(room._doc._id, updatedRoom.timeLimit);
        testArray.push(updatedRoom.timeLimit)
      })
      app.io.emit("/sToC/rooms/needToRefresh",);
      res.json({ success: true });
    }
  })
})

app.post('/api/rooms/auth', (req, res) => {
  console.log("req.body "+req.body);
  Room.findById(req.body._id, (err, roomInfo) => {

    if (err) return res.json({ isAuth: false, })
    else if(!roomInfo) return res.json({isAuth:false})
    else if (roomInfo.isDeleted === true) {
      return res.json({ isAuth: false, ...roomInfo._doc })
    }
    else {
      return res.json({ isAuth: true, ...roomInfo._doc})
    }
  })
})
app.get('/api/rooms/loadList', (req, res) => {
  Room.find({}, async (err, docs) => {
    if (err) return res.json({ success: false })
    return res.json({
      success: true,
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
      if (room._doc.isDeleted === false && room._doc.isStart===false && room._doc.participantID === "" && room._doc.adminID !== req.body.userInfo._id) {
        room.participantID = req.body.userInfo._id;
        room.participantNickname = req.body.userInfo.nickname;
        room.save((err, updatedRoom) => {
          if (err) {
            
            return res.json({ success: false });
          }
          app.io.emit("/sToC/rooms/needToRefresh",);
          return res.json({ success: true })
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

