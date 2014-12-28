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
passport.use('local-register', new LocalStrategy(
  function(username, password, done) {
    User.register(username, password, function(err, user) {
      if(err)
        return done(err);
      if(!user)
        return done(null, false, { message: "User " + username + " already exists" });
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(identifier, done) {
  User.findByUsername(identifier, done);
});

passport.requireLogin = function(req, res, next) {
  if(req.user)
    return next();
  req.flash("error", "You must be logged in to access that!");
  req.session.postLoginTarget = req.baseUrl + req.url;
  res.redirect("/overwatch/login");
};


module.exports = passport;
