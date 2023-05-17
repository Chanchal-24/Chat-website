//server is running at 8081 port

const express = require("express");
const app = express();
const path = require('path');


const port = process.env.PORT || 8081;

const staticpath1 = path.join(__dirname, "/src");
app.use(express.static(staticpath1));
// app.use('/src', express.static(path.join(__dirname, 'index.css')));


const http = require("http").Server(app);

const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'))
})
const users = new Array();
io.on('connection', socket => {
    // console.log("a user conneded");
    // console.log(socket.id);
    socket.emit('old', Object.keys(users).length);
    socket.on('new-user-joined', user => {
        // console.log("new user",user);
        users[socket.id] = user;
        // console.log(`users array : ${users}`); 
        // console.log(typeof users);
        let size = Object.keys(users).length;
        // console.log(`users length ${size}`);
        socket.broadcast.emit('old-user-joined', { user1: users[socket.id], totalnumber: size });
    })
    // socket.on("message",msg=>{
    //     console.log("client message:" +msg);
    // })
    socket.on('send', message2 => {
        // console.log(message2);

        socket.broadcast.emit('receive', { message: message2, user: users[socket.id] })
    })

    socket.on('disconnect', message => {
        let size = Object.keys(users).length;
        size = size - 1;
        socket.broadcast.emit('disconnectuser', { message: users[socket.id], totalnumber: size });
        delete users[socket.id];
    })
})

http.listen(port, () => {
    console.log(`app listening on port ${port}`);
})