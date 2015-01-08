var redis = require('then-redis');
var db = redis.createClient();
var games = {};
var Game = require('./game');
var BPromise = require('bluebird');

games.cache = {};

games.getGame = function(id, callback) {
  if(games.cache[id])
    return BPromise.resolve(games.cache[id]).nodeify(callback);
  var key = "overwatch:game:" + id;
  return db.hgetall(key).then(function(game) {
    if(!game)
      return BPromise.reject(new Error("No such game"));
    games.cache[id] = game;
    return game;
  }).nodeify(callback);
};

games.newGame = function(callback) {
  return db.incr("overwatch:current_game_id").then(function(id) {
    var g = Game.create(id);
    db.hmset("overwatch:game:" + id, g);
    return g;
  }).nodeify(callback);
};

games.saveGame = function(game, callback) {
  return db.hmset("overwatch:game:" + game.id, game)
    .nodeify(callback)
    .then(function() { 
      games.cache[game.id] = game; 
    });
};

module.exports = games;
