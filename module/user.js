const queryList = {
    pseudoId : "SELECT id,pseudo from public.users WHERE id = $1",
    credentialId : "SELECT id,pseudo,password from public.users WHERE pseudo = $1",
    register : "INSERT INTO public.users(pseudo, password, role) VALUES($1, $2, $3) RETURNING *",
    pseudo : "SELECT pseudo from public.users WHERE pseudo = $1"
};
exports.queryList = queryList;
exports.getPseudo = function(id, db, callback) {
    let result;
    db.query(queryList.pseudoId, [id]).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]["pseudo"]).then(() => {
        callback(result);
    });
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
exports.getCredential = function(pseudo, db, callback) {
    let result;
    db.query(queryList.credentialId, [pseudo]).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]).then(() => {
        callback(result);
    });
};
exports.addAccount = function(account, db, callback) {
    let result;
    db.query(queryList.register, account).catch((e) => console.error(e.stack)).then((res) => result = res.rows[0]).then(() => {
        callback(result);
    });
};