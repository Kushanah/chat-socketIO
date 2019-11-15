module.exports = function(req, res, db, io){
    if(!io.alives[req.params.arg]){
        res.status(200).send({
            success : false,
            error : "NotConnected"
        });
        return;
    }
    io.alives[req.params.arg].forEach(value => {
        if(req.body.reason) io.sockets.sockets[value].emit('kick', req.body.reason);
        else io.sockets.sockets[value].emit('kick', false);
        io.sockets.sockets[value].disconnect(true)
    });
    res.status(200).send({
        success : true,
    });
};