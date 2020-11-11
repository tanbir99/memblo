const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new googleStrategy ({
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: process.env.googleCallback
    },
    function (accessToken,regreshToken, profile, cb) {
        return cb(null, profile)
    }
))