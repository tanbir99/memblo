require('./db-index')
User = require('./models/').User

const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

passport.use(new googleStrategy ({
  clientID: process.env.googleID,
  clientSecret: process.env.googleSecret,
  callbackURL: process.env.googleCallback
  },
  function (accessToken,refreshToken, profile, email, done) {
    console.log(email._json)
    User.findOrCreate({
      where: {
        email: email._json.email,
        firstName: email._json.given_name,
        lastName: email._json.family_name
      }
    }).then(function(user) {
      return done(null, user[0].dataValues);
    });
}))


passport.serializeUser(function(user, done) {
  console.log('*****serializing')
  console.log(user)
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  // console.log('deserializing')
  // User.findByPk(id).then(user => {
  //   done(null, user)
  // }).catch(function (err) {
  //   done(err, null)
  // })
  done(null, id)
});