var flash = require('connect-flash');
var session = require('express-session');
var redis_session = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')('dev secret');

module.exports.session = session({
  secret: 'dev secret',
  store: new redis_session(),
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/overwatch' }
});
module.exports.bodyParser = bodyParser.urlencoded({extended: false});
module.exports.flash = flash();
module.exports.cookieParser = cookieParser;

