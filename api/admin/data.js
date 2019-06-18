module.exports = [
    {
        name : "infoAdmin",
        code : require("./methods/info"),
        roleRequire : 2,
    },
    {
        name : "lastAccounts",
        code : require("./methods/lastAccounts"),
        roleRequire : 2,
    },
    {
        name : "kick",
        code : require("./methods/socketio/kick"),
        roleRequire : 1,
    },
    {
        name : "listSockets",
        code : require("./methods/socketio/listSocket"),
        roleRequire : 1,
    },
    {
        name : "user.ejs",
        code : require("./methods/user"),
        roleRequire : 1,
    },
];