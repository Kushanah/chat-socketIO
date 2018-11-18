var socket = io.connect("localhost:8000");
var pseudo;
var notification = new Audio('music/1rKY.mp3');

function send() {
  let chatMessage = {
    pseudo : pseudo,
    message : document.forms[1].elements[0].value
  }
  socket.emit('chat message', chatMessage);
  document.forms[1].elements[0].value = "";
  return false;
};

function setUsername() {
  if(!document.forms[0].elements[0].value) return false
  pseudo = document.forms[0].elements[0].value;
  document.getElementById("pseudoDiv").style.display="none";
  socket.emit('join', pseudo);
}

socket.on('chat message', function(msg){
  let node = document.createElement("LI");
  let textnode = document.createTextNode(msg.pseudo+": "+msg.message);
  node.appendChild(textnode);
  document.getElementById("messages").appendChild(node);
  notification.play();
});
socket.on('usersJoinName', function(username){
  let node = document.createElement("LI");
  let textnode = document.createTextNode("→ "+username);
  node.style.color = "red";
  node.appendChild(textnode);
  document.getElementById("messages").appendChild(node);
  notification.play();
});

socket.on('usersAlive', function(num){
  document.title = "Connectés :" +num;

});
