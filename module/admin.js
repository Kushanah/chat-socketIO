module.exports = {
    getHomePage : function(req, res){
        if(req.session.role === 2) res.render("admin/home.ejs");
        else res.redirect("/")
    }
};