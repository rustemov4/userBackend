require('dotenv').config()
const express = require('express')
const actions = require('./back/actions')
const validate = require('./back/validate')
const app = express();
const session = require('express-session')
const cors = require('cors')
const bodyparser = require('body-parser')
const PORT = process.env.PORT || 5000;
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app)
const io = new Server(server,{
     cors:{
          origin:"http://localhost:3000",
          methods:["GET","POST"]
     }
})



app.use(express.json())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))  
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
const time = 1000 * 100
app.use(session({
     secret: 'secret',
     saveUninitialized: false,
     cookie:
     {    
          maxAge: time,
          httpOnly:true,
     },
     resave: false,
     name:"siid",
     credentials: true,
}));

const allUsers = []
io.on('connection',(socket) =>{
     console.log("connected")
     socket.on('con',(data) =>{
          console.log("con")
          allUsers.push({userName:data,socketId:socket.id})
     })
     socket.on('send', (data) =>{
          console.log(data)
          console.log(allUsers)
          const getUser = allUsers.find(user => user.userName.user === data.to)
          if(getUser){
               socket.to(getUser.socketId).emit('newM',{mes:data.content,from:data.from,time:data.time})
          }
     })
     socket.on('disconnect',() =>{
          const usr = allUsers.find(user => user.socketId === socket.id)
          const ind = allUsers.indexOf(usr)
          if(ind > -1){
               allUsers.splice(ind,1)
               console.log("removed")
               console.log(allUsers)
          }                                                                           
     })
})
app.post('/register',(req,res) => {
     const {login,passwordd,phone,rolee} = req.body
     actions.register({login,passwordd,phone,rolee})
     res.json("Added")

});
app.post('/login',validate.check,(req,res) =>{
     res.json(req.body)
})
app.get('/main',validate.checkAuth,(req,res) =>{
     res.json(req.session)
})
app.get('/allUsers',(req,res) =>{
     actions.getAll().then(data =>{
          res.json({data:data})
     })
})
app.get('/logout',(req,res)=>{
     req.session.destroy()
     res.clearCookie('siid')
     console.log("User logged out")
     res.json({msg:"loggedOut"})
})
server.listen(PORT, () => console.log(`Server Running at port ${PORT} `));