const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value.substring(0,
      profile.photos[0].value.indexOf('?'))

      const newUser = {
        googleID: profile.id,
        image: image
      }


      const existingUser = await User.findOne({ googleID: profile.id })
      if(existingUser) {
        done(null, existingUser);
      } else {
        const user = await new User({ googleID: profile.id }).save()
        done(null, user);
      }
    }
  )
);
