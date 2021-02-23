const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParse = require('body-parser')
const { User } = require('./models/User')
app.use(bodyParse.urlencoded({extended: true}))
app.use(bodyParse.json())

//사실 감춰야하는 사항
const mongoURI="mongodb+srv://hyeonsu:abcd1234@cluster0.tfva0.mongodb.net/Cluster0?retryWrites=true&w=majority"

mongoose.connect(mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  }).then(() => console.log('몽고디비 연결 완료')).catch(err => console.log(err))
  
app.get('/', (req,res) => res.send('Hello World!'))
app.listen(port,()=> console.log(`Example app listening on port ${port}!`))

app.post('api/register', (req,res)=>{
  const user = new User(req.body)
  user.save((err,userInfo)=>{
    if(err) return res.json({success:false,err})
    return res.status(200).json({
      success: true
    })
  })
})
