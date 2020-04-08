//jshint esversion:6

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, (username, password, done) => {

        User.findOne({
            username: username
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: "Aucun utilisateur trouvé"
                });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {

                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "Mot de passe incorrecte !"
                    });
                }
            });
        });

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};