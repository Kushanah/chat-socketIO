const dbUtils = require("../../../module/dbUtils");
module.exports = function(req, res, db) {
    dbUtils.countAccounts(db, (resAccount) => {
        if(!resAccount){
            res.status(503).send();
        } else {
            dbUtils.countVists(db, (resVisit) => {
                if(!resVisit){
                    res.status(503).send();
                } else {
                    res.status(200).send({
                        "success": true,
                        "data" : {
                            "countAccounts" : resAccount.rows[0].id,
                            "countReports" : "WIP",
                            "countsVisits" : resVisit
                        }
                    })
                }
            })
        }
    })

};
