var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var logger = require('morgan');

var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);

var users = [];

app.use(logger('dev'));
app.use(express.static('public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    
    var currentUser = null;
    
    socket.on('userEnter', function (username) {
        if (username && username != null) {
            currentUser = username;
            users.push(username);
            console.log('a user connected ' + JSON.stringify(users));
            io.emit('userEnter', users);
            io.emit('chat message', "user " + currentUser + " has joined to chat");
        }
    });
    
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', currentUser + ": " + msg);
    });
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
        if (currentUser != null) {
            users.splice(users.indexOf(currentUser), 1);
            io.emit('userExit', currentUser);
        }
    });
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});