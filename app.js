const express = require('express');
const app = express();

const crypto = require('crypto');
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const bcrypt = require('bcrypt');
const session = require('express-session');
const {Pool, Client} = require('pg');
const moduleDB = require("module/user.js");
const saltRounds = process.env.salt || 4;
const salt = bcrypt.genSaltSync(saltRounds);
const port = process.env.PORT || 8000;
const storageSession = session({
    secret : process.env.secret || "secret :O"
});
let usersAlive = 0;
const db = new Pool({
    connectionString : 'postgresql://nodeA:lisemi@localhost:5432/chat',
});

app.use(express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/'));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma-tooltip/'));
app.use("/static", express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true,}));
app.use(storageSession);
io.use(function(socket, next) {
    storageSession(socket.request, socket.request.res, next);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    if(req.session.accountid) {
        const query1 = 'SELECT id,pseudo from public.users WHERE id = $1';
        db.query(query1, [req.session.accountid]).catch(e => console.error(e.stack)).then(resD => {
            res.render('index.ejs', {pseudo : resD.rows[0]['pseudo']});
        });
    } else res.redirect('/login');
});
app.get('/register', function(req, res) {
    res.render('register.ejs', {errors : "none",})
});
app.get('/login', function(req, res) {
    if(req.session.accountid) res.redirect('/');
    else res.render('login.ejs', {
        errors : "none",
    })
});
app.get('/logout', function(req, res) {
    req.session.destroy((err) => {
        if(!err) res.render('login.ejs', {errors : "logout"}); else res.send(403)
    })
});
app.post('/login', function(req, res) {
    const query1 = 'SELECT id,pseudo,password from public.users WHERE pseudo = $1';
    db.query(query1, [req.body.pseudo]).catch(e => console.error(e.stack)).then((resD) => {
        if(!resD.rows[0]) res.render("login.ejs", {errors : "incorrect"});
        else {
            if(bcrypt.compareSync(req.body.password, resD.rows[0]['password'])) {
                req.session.accountid = resD.rows[0]['id'];
                res.redirect('/');
            } else res.render("login.ejs", {errors : "incorrect"});
        }

    })
});
app.post('/register', function(req, res) {
    let hash = bcrypt.hashSync(req.body.password, salt);
    const query1 = 'INSERT INTO public.users(pseudo, password, role) VALUES($1, $2, $3) RETURNING *';
    const query2 = "SELECT pseudo from public.users WHERE pseudo = $1";
    const values = [req.body.pseudo, hash, 0];
    if(req.body.pseudo && req.body.password) {
        db.query(query2, [req.body.pseudo]).catch(e => console.error(e.stack)).then((resD) => {
            if(!resD.rows[0]) {
                db.query(query1, values).catch(e => console.error(e.stack)).then(() => res.redirect("/login"))
            } else res.render("register.ejs", {errors : "name"});
        });
    } else {
        res.render("register.ejs", {errors : "vide"});
        return false;
    }

});

io.on('connection', function(socket){
    if(socket.request.session) {
        if(socket.request.session.accountid) {
            const query1 = 'SELECT id,pseudo from public.users WHERE id = $1';
            let pseudo;
            db.query(query1, [socket.request.session.accountid]).catch(e => console.error(e.stack)).then(resD => pseudo = resD.rows[0]['pseudo']);
            socket.on('disconnect', function() {
                if(usersAlive > 0) usersAlive--;
                let alive = {
                    usersAlive : usersAlive,
                    pseudo : pseudo,
                };
                if(usersAlive > 0) io.emit('leave', alive);
            });
            socket.on('chat message', function(msg) {
                if(msg && msg.message) {
                    let newMsg = {
                        pseudo : pseudo,
                        message : msg.message
                    };
                    io.emit('chat message', newMsg);
                } else {
                    socket.disconnect('unauthorized');
                }
            });
            socket.on('join', function() {
                usersAlive++;
                let alive = {
                    usersAlive : usersAlive,
                    pseudo : pseudo,
                };
                io.emit('join', alive);
            });
        } else {
            socket.disconnect('NoValidID');
        }
    } else {
        socket.disconnect('NoID');
    }

});

http.listen(port);
console.log("Démarrage du server sur le port " + port);
