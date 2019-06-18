const moduleDB = require("../../../module/dbUtils");
module.exports = function(req, res, db, io){
    if(!req.params.arg){
        res.status(200).send({
            success : false,
            error : "MissingArg"
        });
        return;
    }
    moduleDB.getInfoAccount(req.params.arg, db, (resDB) => {
        if(!resDB){
            res.status(200).send({
                success : false,
                error : "Nobody"
            });
        } else if(resDB === "Error"){
            res.status(500).send({
                success : false,
                error : "DB error"
            });
        } else if(resDB) {
            res.status(200).send({
                success : true,
                data : resDB.rows,
            });
        }
    });
};