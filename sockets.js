var socket = require('socket.io');
var games = require('./games');
var Game = require('./game.js');
var middleware = require('./middleware');

var io;

module.exports.attach = function(http) {
  io = socket(http, {
    path: "/overwatch/socket.io/"
  });
  io.use(function(socket, next) {
    socket.response = {};
    middleware.cookieParser(socket.request, socket.response, function(err) {
      if(err) return next(err);
      middleware.session(socket.request, socket.response, next);
    });
  });
  io.use(authenticateSocket);
  io.on('connection', handleSocketConnection);
};
function authenticateSocket(socket, next) {
  if(socket.request.session.passport.user) {
    next();
  }
  else {
    next(new Error("Not logged in"));
  }
}
function handleSocketConnection(socket) {
  socket.join(socket.request.session.gameId);
  games.getGame(socket.request.session.gameId).then(function(game) {
    Game.registerNewSocket(game, socket);
  });
}
module.exports.io = io;
