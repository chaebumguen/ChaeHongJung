// 시작점 express, mongoose
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");


//바디파서로 데이터를 가져옴
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ghdrlf:1234@chae.lnozb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect'))
    .catch(err => console.log(err))
//use .. -> 에러 제거용






app.get('/', (req,res) => res.send('Hello World'))


app.post('/register', (req,res) => {
    //회원 가입시 필요한 정보들을 클라이언트에서 가져오면, 그것들을 데이터 베이스에 넣어주는 코드

    const user = new User(req.body)

    user.save((err,dec) => {
        if(err) return res.json({sucess:false, err})
        return res.status(200).json({
            sucess: true
        })
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//mongodb+srv://ghdrlf:<password>@cluster0.lnozb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority