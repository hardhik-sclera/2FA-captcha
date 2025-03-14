const express= require('express')
const app=express()

const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const cors=require('cors')  
dotenv.config();
require('./config/passport-config.js');

app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(cors({
    origin: '*',                // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true           // Allow cookies (if needed)
 } ))
app.use(passport.initialize());
app.use(passport.session());


app.get('/home', (req, res) => {
    res.send("Hi User")
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });
app.get('/github/callback',(req,res)=>{
    res.redirect('/home')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/');
});
app.get('/google/callback',(req,res)=>{
        res.redirect('/home')
    })
app.listen(3000,()=>{
    console.log('Server started')
})