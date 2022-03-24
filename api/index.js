const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const expressjwt = require('express-jwt')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cors())


app.use(express.json())
app.use(cookieParser())

var pastcookies = []


//database

const users = [
    {
        id: 1,
        username: "a",
        password: "a",
        isAdmin: true
    },
    {
        id: 2,
        username: "b",
        password: "b",
        isAdmin: false
    }
]

var secretKey = "secretKey123"

function generateAccessToken(user){
    var payload = {
        id: user.id,
        isAdmin: user.isAdmin
    }
    var token = jwt.sign(payload, secretKey,{expiresIn : "15min"})
    return token
}

const verify = (req,res,next) => {
    const token = req.headers.authorization
    if(token){

        jwt.verify(token,secretKey,(err,user)=>{
            if(err)
                return res.status(403).json("Not a valid token")
            
            req.user = user
            next()
        })
    }
    else res.status(401).json("you are not authenticated")
}


app.post('/api/login', (req, res) => {
    const { username, password } = req.body

    var user = users.find(x => {
        return x.username === username && x.password === password
    })

    if (user) {
        
        var accessToken = generateAccessToken(user)
        res.cookie('token',accessToken,{httpOnly:true})

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken
        })
    }
    else {
        res.status(400).json("Failed")
    }
})

app.use(expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring (req) {
      if (req.cookies.token) {
          return req.headers.authorization = req.cookies.token;
      }
      return null;
    }
  }));

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return null
    }
  });

app.post('/api/reload',verify,(req,res)=>{
    var token = req.headers.authorization
    return res.status(200).json(token)
})

app.post('/api/logout',verify,(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json("successfully logout")
})

app.delete('/api/users/:userId',verify, (req,res)=>{
    if(parseInt(req.user.id) === parseInt(req.params.userId) || req.user.isAdmin)
        return res.json("deleted")
    else
        return res.status(403).json("failedtodelete")
})

app.listen(5000)