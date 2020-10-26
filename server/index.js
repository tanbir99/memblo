const express = require( 'express' );
const app = new express();
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' )
const passport = require('passport')
require('./passport-setup')


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => res.send("Hello!"))


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
});

app.get('/failed', (req, res) => res.send("You failed to login"))
app.get('/success', (req, res) => res.send("It works!"))




app.post('/authenticate', (req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "hello"});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('App running')
})