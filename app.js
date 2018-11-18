const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8080;
var usersAlive = 0;

app.use(express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/views/"+ 'index.html');
});
app.get('scripts/chatSystem.js', function(req, res) {
  res.send(__dirname + "/views/scripts/chatSystem.js");
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    usersAlive--;
    if(usersAlive > 0) io.emit('usersAlive', usersAlive);
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    if(msg && msg.message) io.emit('chat message', msg);
  });
  socket.on('join',function(username){
    console.log(username);
    usersAlive++;
    io.emit('usersAlive', usersAlive);
    io.emit('usersJoinName',username);
  });
});

app.listen(port, () => console.log("Listening on *:8080"));
http.listen(8000)
