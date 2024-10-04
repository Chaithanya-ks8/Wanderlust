module.exports. isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.rdirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
if(req.session.redirectUrl){
    res.locals.redirect = req.session.redirectUrl;
}
next();
}