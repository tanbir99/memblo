require('./db-index')
User = require('./models/').User

const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

passport.use(new googleStrategy ({
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: process.env.googleCallback
    },
    function (accessToken,regreshToken, profile, cb) {
      console.log(profile._json.email)
      User.findOne({
        where: {email: profile._json.email},
        function (err, user) {
          if (err) {
            return done(err)
          } if (user) {
            return done(null, user)
          } else {
            new User({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile._json.email,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            return done(null, user)
          }
        }
      })
      return cb(null, profile)
    }
))