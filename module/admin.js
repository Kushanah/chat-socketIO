module.exports = {
    getHomePage : function(req, res){
        if(req.session.role === 2) res.render("admin/home.ejs", {pseudo : req.session.pseudo});
        else res.redirect("/")
    },
    getUsersPage : function(req, res){
        if(req.session.role === 2) res.render("admin/user.ejs", {pseudo : req.session.pseudo});
        else res.redirect("/")
    }
};