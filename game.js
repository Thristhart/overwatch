var Game = {};
var log = require('debug')("overwatch:game");

Game.tick = function(state) {
};

Game.create = function(id) {
  var game = {};
  game.id = id;
  game.agent = null;
  game.overwatch = null;
  log("new game @%s", id);
  return game;
};

Game.registerNewSocket = function(state, socket) {
  var username = socket.request.session.passport.user;
  log("register new socket for %s @%s", username, state.id);
  socket.on('disconnect', function() {
    log("client disconnected");
  });
  socket.on('ping', function() {
    socket.emit('pong', Date.now());
  });
  if(username == state.agent) {
    state.agentSocket = socket;
    log("user %s is agent @%s", username, state.id);
  }
  if(username == state.overwatch) {
    state.overwatchSocket = socket;
    log("user %s is overwatch @%s", username, state.id);
  }
};


module.exports = Game;
