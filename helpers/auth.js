//jshint esversion:6
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error", "Pas autorisé");
            res.redirect("/users/login");
        }
    }
}