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
    document.title = "Connectés : " + aliveObj.usersAlive;
    addLeave(aliveObj.pseudo);
    notification.play();
});

socket.on('kick', function(arg) {
    let mDiv = document.querySelector("#message");
    document.querySelector("#inputText").disabled = true;
    let clone = document.importNode(document.querySelector("#kickTemplate").content, true);
    if(!arg) clone.querySelector("p").textContent = "Vous avez été kick du chat !";
    else if(arg) clone.querySelector("p").textContent = 'Vous avez été kick du chat pour : "' + arg + '" !';
    mDiv.appendChild(clone);
    mDiv.scrollIntoView(false);
});
function kick(user,reason){
    fetch('/api/panel/kick/' + user,{
        method: 'POST',
        body: JSON.stringify({
            reason : reason
        }),
        headers: {"Content-Type": "application/json"}
    }).then((res) => {
        let mDiv = document.querySelector("#message");
        let clone = document.importNode(document.querySelector("#kickModTemplate").content, true);
        if(res.status === 500) clone.querySelector("p").textContent = "Le serveur n'a pas pu kick pour un raison inconnu...";
        else if(res.status === 200) res.json().then((json) => {
             if(json.success) clone.querySelector("p").textContent = "L'utilisateur a été kick !";
             else if(!json.success && json.error === "NotConnected") clone.querySelector("p").textContent = "L'utilisateur n'est pas connecté";
        });
        mDiv.appendChild(clone);
        mDiv.scrollIntoView(false);
    })
}

socket.on('disconnect', function() {
    //alert("Au revoir !")
});