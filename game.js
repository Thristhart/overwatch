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


module.exports = Game;
