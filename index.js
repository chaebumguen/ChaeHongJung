// 시작점 express, mongoose
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");


//바디파서로 데이터를 가져옴
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ghdrlf:1234@chae.lnozb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect'))
    .catch(err => console.log(err))
//use .. -> 에러 제거용






app.get('/', (req,res) => res.send('Hello World'))


app.post('/api/user/register', (req,res) => {
    //회원 가입시 필요한 정보들을 클라이언트에서 가져오면, 그것들을 데이터 베이스에 넣어주는 코드

    const user = new User(req.body)

    user.save((err,dec) => {
        if(err) return res.json({sucess:false, err})
        return res.status(200).json({
            sucess: true
        })
    })

})


app.post('/api/user/login', (req,res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email:req.body.email }, (err,user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

    //요청한 이메일이 데이터베이스에 있다면 비밀번호와 같은지 확인한다.

    user.comparePassword(req.body.password,(err,isMatch)=>{
        if(!isMatch)
        return res.json ({loginSuccess:false, maessage:"잘못된 비밀번호" })
  
        //3.비밀번호도 같다면 token 생성
        user.generateToken((err,user)=>{
          if(err) return res.status(400).send(err);
          //token을 쿠키에 저장
          res.cookie("x_auth",user.token)
          .status(200)
          .json({loginSuccess:true,userId:user._id})
        })

})
})
})
//auth : 권한에 맞는 페이지에만 접근하게 해줌
app.get('/api/user/auth', auth, (req,res) => {

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role ===0 ? false : true,
        
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))