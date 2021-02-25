const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const {auth} = require('./middleware/auth')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

//사실 감춰야하는 사항
const mongoURI="mongodb+srv://hyeonsu:abcd1234@cluster0.tfva0.mongodb.net/Cluster0?retryWrites=true&w=majority"

mongoose.connect(mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  }).then(() => console.log('몽고디비 연결 완료')).catch(err => console.log(err))
  
app.get('/', (req,res) => res.send('Hello World!'))
app.post('/api/users/findByID',(req,res)=>{
  User.findById(req.body._id,(err, user) => {
  
    if (!user) {
      return res.json({
        success:false,
        ...user._doc})
    }
    else{
      return res.json({
        success:true,
        ...user._doc
      })
    }
  })

})
app.post('/api/users/register', (req,res)=>{
  //Todo 중복 이메일 걸러내야함.
  const user = new User(req.body)
  user.save((err,userInfo)=>{
    if(err) return res.json({success:false,err})
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
app.get('/api/users/auth',auth,(req,res)=>{
  res.status(200).json({
    _id:req.user.id,
    email:req.user.email,
    nickname:req.user.nickname,

    token:req.token,
    onlineState: req.onlineState
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
app.get('/api/axiostest',(req,res)=>{
  res.send("axiostest 중입니다.")
})
app.post('/api/users/createRoom',(req,res)=>{
  console.log(req.body);
})

app.listen(port,()=> console.log(`Example app listening on port ${port}!`))