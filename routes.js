var router = require('express').Router();
var passport = require('./auth');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({extended: false}));
router.use(flash());
router.use(session({
  secret: 'dev secret',
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/overwatch' }
}));
router.use(passport.initialize());
router.use(passport.session());

router.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.message = req.flash('message');
  next();
});
router.get('/', function(req, res) {
  res.render('index.html');
});
router.get('/login', function(req, res) {
  res.render('login.html');
});
router.get('/register', function(req, res) {
  res.render('register.html');
});
// TODO: sanitize input
router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', {
      failureRedirect: req.baseUrl + "/login",
      failureFlash: true
    })(req, res, next);
  },
  function(req, res, next) {
    if(req.session.postLoginTarget) {
      res.redirect(req.session.postLoginTarget);
      delete(req.session.postLoginTarget);
    }
    else {
      res.redirect(req.baseUrl + "/");
    }
  }
);
router.post('/register', function(req, res, next) {
    passport.authenticate('local-register', { 
      failureRedirect: req.baseUrl + "/register",
      failureFlash: true 
    })(req, res, next);
  },
  function(req, res, next) {
    if(req.session.postLoginTarget) {
      res.redirect(req.session.postLoginTarget);
      delete(req.session.postLoginTarget);
    }
    else {
      res.redirect(req.baseUrl + "/");
    }
  }
);
router.post('/register', 
  passport.authenticate('local-register', { 
    successRedirect: "/overwatch",
    failureRedirect: "/overwatch/register",
    failureFlash: true 
  })
);

module.exports = router;
