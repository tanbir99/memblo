require('dotenv').config();
require('./passport-setup')
require('./db-index')


// npm modules
const bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session')
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');


// server and middleware setup
const app = new express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    return uuidv4()
  },
  secret: process.env.session_secret,
  saveUninitialized: false
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
    res.redirect('/success');
});

app.get('/failed', (req, res) => res.send("You failed to login"))
app.get('/success', (req, res) => res.send("It works!"))

app.post('/authenticate', (req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
});


// listen at PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running at ${PORT}`)
})