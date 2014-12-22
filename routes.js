var router = require('express').Router();
var passport = require('./auth');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');


router.use(bodyParser());
router.use(flash());
router.use(session({
  secret: 'dev secret',
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/overwatch' }
}));
router.use(passport.initialize());
router.use(passport.session());

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
router.post('/login', 
  passport.authenticate('local-login', { 
    successRedirect: "/overwatch",
    failureRedirect: "/overwatch/login",
    failureFlash: true 
  })
);
router.post('/register', 
  passport.authenticate('local-register', { 
    successRedirect: "/overwatch",
    failureRedirect: "/overwatch/register",
    failureFlash: true 
  })
);

module.exports = router;
