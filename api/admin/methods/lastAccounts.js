const dbUtils = require("../../../module/dbUtils");
module.exports = function(req, res, db) {
    dbUtils.lastAccounts(db, (resDB) => {
        if(!resDB) {
            res.status(503).send();
        } else {
            res.status(200).send({
                "success" : true,
                "data" : resDB
            })

        }
    })

};