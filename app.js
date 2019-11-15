const express = require("express");
const app = express();

const http = require("http").Server(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(http);
const bcrypt = require("bcrypt");
const session = require("express-session");
const {Pool} = require("pg");
const moduleDB = require("./module/dbUtils");
const pageModule = {
    admin : require("./module/admin"),
};
const api = {
    errors : {
        notPerm : require("./api/errors/notEnoughPermission"),
        noMethod : require("./api/errors/noMethods"),
    },
    admin : require("./api/admin/data"),
};

const saltRounds = process.env.SALT || 4;
const salt = bcrypt.genSaltSync(saltRounds);
const port = process.env.PORT || 80;
const storageSession = session({
    secret : process.env.SECRET || "secret :O"
});

let usersAlive = 0;
const db = new Pool({
    connectionString : process.env.DB,
});

app.use(express.static(__dirname + "/node_modules/socket.io-client/dist/"));
app.use("/bulma", express.static(__dirname + "/node_modules/bulma-tooltip/"));
app.use("/static", express.static(__dirname + "/static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true,}));
app.use(storageSession);
io.use(function(socket, next) {
    storageSession(socket.request, socket.request.res, next);
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    moduleDB.incrementVisits(db);
    if(req.session.accountid) {
        moduleDB.getPseudo(req.session.accountid, db, (r) => {
            res.render("index.ejs", {pseudo : r});
        });
    } else {
        res.redirect("/login");
    }

});
app.get("/register", function(req, res) {
    res.render("connection/register.ejs", {errors : "none",});
});
app.get("/login", function(req, res) {
    if(req.session.accountid) {
        res.redirect("/");
    } else {
        res.render("connection/login.ejs", {
            errors : "none",
        });
    }
});
app.get("/logout", function(req, res) {
    req.session.destroy((err) => {
        if(!err) {
            res.render("connection/login.ejs", {errors : "logout"});
        } else {
            res.send(403);
        }
    });
});
// Panel
app.get("/panel", (req, res) => pageModule.admin.getHomePage(req, res));
app.get("/panel/users", (req, res) => pageModule.admin.getUsersPage(req, res));


app.post("/login", function(req, res) {
    moduleDB.getLogin(req.body.pseudo, db, (r) => {
        if(!r) res.render("connection/login.ejs", {errors : "incorrect"});
        else if(bcrypt.compareSync(req.body.password, r.password)) {
            req.session.accountid = r.id;
            req.session.pseudo = r.pseudo;
            req.session.role = r.role;
            res.redirect("/");
        } else {
            res.render("connection/login.ejs", {errors : "incorrect"});
        }
    });
});
app.post("/register", function(req, res) {
    if(req.body.pseudo && req.body.password) {
        const values = [req.body.pseudo, bcrypt.hashSync(req.body.password, salt), 0];
        moduleDB.checkPseudo(req.body.pseudo, db, (r) => {
            if(r) {
                moduleDB.addAccount(values, db, () => {
                    res.redirect("login");
                });
            } else {
                res.render("connection/register.ejs", {errors : "name"});
            }
        });

    } else {
        res.render("connection/register.ejs", {errors : "vide"});
        return false;
    }

});


// API

app.all('/api/panel/:methods/:arg?', function(req, res){
    if(req.session.role > 0 && req.params.methods) {
        for(let key in api.admin){
            if(api.admin.hasOwnProperty(key)){
                if(req.params.methods === api.admin[key].name && req.session.role >= api.admin[key].roleRequire) {
                    api.admin[key].code(req, res, db, io);
                    return;
                }
                else if(req.session.role < api.admin[key].roleRequire) res.status(403).send(api.errors.notPerm);
            }
        }
        res.status(404).send(api.errors.noMethod);
    }
    else if (req.session.role === 0 || !req.session.role) res.status(403).send(api.errors.notPerm);
    else res.status(503)
});

// SOCKET
io.alives = {};
io.on("connection", function(socket) {
    if(socket.request.session.accountid && socket.request.session) {
        let pseudo = socket.request.session.pseudo;
        socket.on("disconnect", function() {
            io.alives[pseudo] = io.alives[pseudo].filter(item => item !== socket.id);
            if(io.alives[pseudo] <= 0) delete io.alives[pseudo];
            if(usersAlive > 0) {
                usersAlive--;
            }
            let alive = {
                usersAlive : usersAlive,
                pseudo : pseudo,
            };
            if(usersAlive > 0) {
                io.emit("leave", alive);
            }
        });
        socket.on("chat message", function(msg) {
            if(msg && msg.message) {
                let newMsg = {
                    pseudo : pseudo,
                    message : msg.message
                };
                io.emit("chat message", newMsg);
            } else {
                socket.disconnect(true);
            }
        });
        socket.on("join", function() {
            io.alives[pseudo] = [];
            io.alives[pseudo].push(socket.id);
            usersAlive++;
            let alive = {
                usersAlive : usersAlive,
                pseudo : pseudo,
            };
            io.emit("join", alive);
        });
    } else {
            socket.disconnect(true);
    }

});

http.listen(port);
console.log("Démarrage du server sur le port " + port);
