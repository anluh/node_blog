const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

/* Register form */
router.get('/register', function(req, res) {
  res.render('register');
});

// Register Process
router.post("/register", (req, res)=>{
  const
    name = req.body.name,
    email = req.body.email,
    username = req.body.username,
    password = req.body.password,
    password2 = req.body.password;

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Password do not match').equals(req.body.password);

  // Get Errors

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      title: 'Register',
      errors: errors
    })
  } else {

    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          console.log(err);
        }
        newUser.password = hash;

        newUser.save((err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Registration complete');
            res.redirect('/users/login');
          }
        });
      })
    });
  }

});

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
 passport.authenticate('local', {
   successRedirect:'/',
   failureRedirect:'/users/login',
   failureFlash: true
 })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;
