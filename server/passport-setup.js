require('./db-index')
User = require('./models/').User

const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

passport.use(new googleStrategy ({
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: process.env.googleCallback
    },
    async function (accessToken,refreshToken, profile, email, done) {
      // console.log(email._json)
      const user = await User.findOne({where: {email: email._json.email}})
      if (user) {
        console.log('user found')
        console.log(user.dataValues)
        return done(null, user)
      }
      else {
        console.log('creating user')
        User.create({
          id: email.id,
          firstName: email._json.givenName,
          lastName: email._json.familyName,
          email: email._json.email,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return done(null, user)
      }
    }
))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(user => {
    done(err, user);
  })
});