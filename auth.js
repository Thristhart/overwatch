var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./user');

passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    User.findByUsername(username, function(err, user) {
      if(err)
        return done(err);
      if(!user)
        return done(null, false, { message: "Username " + username + " does not exist" });
      if(!user.checkPasswordHash(password))
        return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.username);
});
passport.deserializeUser(function(identifier, done) {
  User.findByUsername(identifier, function(err, user) {
    if(err)
      return done(err);
    return done(null, user);
  });
});


module.exports = passport;
