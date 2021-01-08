require('dotenv').config();
require('./passport-setup')
sequelize = require('./db-index')


// npm modules
const bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
// const { v4: uuidv4 } = require('uuid');


// server and middleware setup
const app = new express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: process.env.session_secret,
  cookie: {
    maxAge: 1800000,
    // secure: process.env.secure_cookie
  },
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


// temp home page
app.get('/', (req, res) => res.send("Hello!"))


// auth setup
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    console.log('user is', req.user)
    res.redirect('/success');
  }
);

app.get('/failed', (req, res) => res.send("You failed to login"))
app.get('/success',
  function (req, res) {
    res.send(`It works, ` + req.user + `!`)
  }
)

app.post('/authenticate', (req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
});


// listen at PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running at ${PORT}`)
})