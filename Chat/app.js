﻿var express = require('express');
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
   
    var currentUser = '';
    
    socket.on('userEnter', function (username) {
        currentUser = username;
        users.push(username);
        console.log('a user connected ' + JSON.stringify(users));
        io.emit('userEnter', users);
    });
    
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
        users.splice(users.indexOf(currentUser), 1);
        io.emit('userExit', currentUser);
    });
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});