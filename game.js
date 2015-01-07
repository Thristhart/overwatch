var Game = {};

Game.tick = function(state) {
};

Game.create = function(id) {
  var game = {};
  game.id = id;
  game.agent = null;
  game.overwatch = null;
  return game;
};

Game.registerNewSocket = function(state, socket) {
  socket.on('disconnect', function() {
    console.log("Game client disconnected");
  });
  socket.on('ping', function() {
    socket.emit('pong', Date.now());
  });
};


module.exports = Game;
