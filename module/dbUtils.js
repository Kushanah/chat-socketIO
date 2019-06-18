const queryList = {
    pseudoId : "SELECT id,pseudo from public.users WHERE id = $1",
    visitView : "SELECT value from public.statics WHERE data = 'visits'",
    login : "SELECT id,pseudo,password,role from public.users WHERE pseudo = $1",
    info : "SELECT id,pseudo,role from public.users WHERE pseudo = $1",
    register : "INSERT INTO public.users(pseudo, password, role) VALUES($1, $2, $3) RETURNING *",
    pseudo : "SELECT pseudo from public.users WHERE pseudo = $1",
    list : "SELECT MAX(ID) AS Id FROM public.users",
    visitAdd : "UPDATE public.statics SET value = value + 1 WHERE data = 'visits'",
    lastAccounts : "SELECT pseudo FROM public.users ORDER BY id DESC LIMIT 5",
};

exports.queryList = queryList;
exports.getPseudo = function(id, db, callback) {
    let result;
    db.query(queryList.pseudoId, [id]).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]["pseudo"]).then(() => {
        callback(result);
    });
};
exports.countAccounts = function(db, callback){
    db.query(queryList.list).catch((e) => {
        console.error(e.stack);
        callback(false);
    }).then((res) => callback(res));

};
exports.countVists = function(db, callback){
    db.query(queryList.visitView).catch((e) => {
        console.error(e.stack);
        callback(false);
    }).then((res) => callback(res.rows[0].value));

};
exports.lastAccounts = function(db, callback){
    db.query(queryList.lastAccounts).catch((e) => {
        console.error(e.stack);
        callback(false);
    }).then((res) => callback(res.rows));

};

exports.incrementVisits = function(db){
    db.query(queryList.visitAdd).catch((e) => console.error(e.stack))
};

exports.checkPseudo = function(pseudo, db, callback) {
    let result;
    db.query(queryList.pseudo, [pseudo]).catch((e) => console.error(e.stack))
        .then((res) => {
            result = res.rows[0];
        }).then(() => {
        if(result){
            callback(false);
        }else{
            callback(true);
        }
    });
};
exports.getLogin = function(pseudo, db, callback) {
    let result;
    db.query(queryList.login, [pseudo]).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]).then(() => {
        callback(result);
    });
};
exports.getInfoAccount = function(pseudo, db, callback) {
    db.query(queryList.info, [pseudo]).catch((e) => {
        console.error(e.stack);
        callback("Error");
    }).then((res) => callback(res));

};
exports.addAccount = function(account, db, callback) {
    let result;
    db.query(queryList.register, account).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]).then(() => {
        callback(result);
    });
};