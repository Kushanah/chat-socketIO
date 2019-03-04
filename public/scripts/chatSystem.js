let socket = io('/');
const notification = new Audio('static/music/1rKY.mp3');

function send() {
    let chatMessage = {
        message : document.forms[0].elements[0].value,
    };
    socket.emit('chat message', chatMessage);
    document.forms[0].elements[0].value = "";
    return false;
}

function addUserLine(pseudo, message) {
    let m = document.querySelector("#userTemplate");
    let mDiv = document.querySelector("#message");
    let clone = document.importNode(m.content, true);
    clone.querySelector("span").textContent = message;
    clone.querySelector("figure").setAttribute("data-tooltip", pseudo);
    mDiv.appendChild(clone);
    mDiv.scrollIntoView(false);
}

function addJoin(pseudo) {
    let m = document.querySelector("#joinTemplate");
    let mDiv = document.querySelector("#message");
    let clone = document.importNode(m.content, true);
    clone.querySelector("p").textContent = pseudo + " a rejoins le chat";
    mDiv.appendChild(clone);
    mDiv.scrollIntoView(false);
}

function addLeave(pseudo) {
    let m = document.querySelector("#joinTemplate");
    let mDiv = document.querySelector("#message");
    let clone = document.importNode(m.content, true);
    clone.querySelector("p").textContent = pseudo + " a quitté le chat";
    mDiv.appendChild(clone);
    mDiv.scrollIntoView(false);
}

function addMeLine(message) {
    let m = document.querySelector("#meTemplate");
    let mDiv = document.querySelector("#message");
    let clone = document.importNode(m.content, true);
    clone.querySelector("span").textContent = message;
    clone.querySelector("figure").setAttribute("data-tooltip", pseudo);
    mDiv.appendChild(clone);
    mDiv.scrollIntoView(false);
}

socket.on('chat message', function(msg){
    if(pseudo === msg.pseudo) addMeLine(msg.message);
    else {
        addUserLine(msg.pseudo, msg.message);
        notification.play();
    }
});

socket.on('join', function(aliveObj) {
    document.title = "Connectés : " + aliveObj.usersAlive;
    addJoin(aliveObj.pseudo);
    notification.play();
});

socket.on('leave', function(aliveObj) {
    console.log(aliveObj);
    document.title = "Connectés : " + aliveObj.usersAlive;
    addLeave(aliveObj.pseudo);
    notification.play();
});