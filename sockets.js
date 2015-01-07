var socket = require('socket.io');
var games = require('./games');
var io;


module.exports.attach = function(http) {
  io = socket(http, {
    path: "/overwatch/socket.io/"
  });
  io.use(authenticateSocket);
  io.on('connection', handleSocketConnection);
};
function authenticateSocket(socket, next) {
  if(socket.request.user) {
    next();
  }
  else {
    next(new Error("Not logged in"));
  }
}
function handleSocketConnection(socket) {
  socket.join(socket.request.session.gameId);
  games.getGame(socket.request.session.gameId).then(function(game) {
    game.registerNewSocket(game, socket);
  });
}
module.exports.io = io;
