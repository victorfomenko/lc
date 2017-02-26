const express = require('express');
const router = require('express').Router();
const passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

module.exports = router;

// Middlewares, которые должны быть определены до passport:
router.use(require('cookie-parser')());
router.use(require('express-session')({secret:'r98324ht283', resave: true, saveUninitialized: true}));

// Passport:
router.use(passport.initialize());
router.use(passport.session());

passport.use(new VKontakteStrategy(
  {
    clientID:     '5896971', // VK.com docs call it 'API ID', 'router_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: '7W46KOkfk8Am3TDLjxEX',
    callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
  },
  function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {

    // Now that we have user's `profile` as seen by VK, we can
    // use it to find corresponding database records on our side.
    // Also we have user's `params` that contains email address (if set in 
    // scope), token lifetime, etc.
    // Here, we have a hypothetical `User` class which does what it says.
    User.findOrCreate({ vkontakteId: profile.id })
        .then(function (user) { done(null, user); })
        .catch(done);
  }
));

router.get('/user', function(req, res){
	res.json(req.user);
})