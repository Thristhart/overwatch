var router = require('express').Router();
var passport = require('./auth');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var static = require('express').static;

var games = require('./games');


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
router.all('/game/*', passport.requireLogin);
router.get('/game/new', function(req, res) {
  res.render("newGame.html");
});
router.post('/game/new', function(req, res, next) {
  games.newGame(function(err, game) {
    if(err)
      return next(err);
    if(req.body.role == "agent")
      game.agent = req.user.username;
    else if(req.body.role == "overwatch")
      game.overwatch = req.user.username;
    req.session.gameId = game.id;

    games.saveGame(game).then(function() {
      res.redirect(req.baseUrl + "/game/" + game.id);
    });
  });
});

router.get('/game/:id', 
  function(req, res, next) {
    var id = req.params.id;
    games.getGame(id, function(err, game) {
      if(err || !game)
        return next(err);
      res.render('game.html', {
        id: game.id,
        overwatch: game.overwatch,
        agent: game.agent
      });
    });
  }
);

router.use('/static', static(__dirname + "/static"));

// last middleware, therefore nothing else has succeeded on this route
router.use(function(req, res, next) {
  res.status(404);
  res.format({
    text: function() {
      res.send("404 Not Found");
    },
    html: function() {
      res.render("404.html");
    },
    json: function() {
      res.send({ error: 404 });
    }
  });
});
module.exports = router;
