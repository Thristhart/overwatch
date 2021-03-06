// TODO: Replace hashing with an actual hash algorithm
var redis = require('then-redis');
var db = redis.createClient();
var bcrypt = require('bcrypt');

var User = {};


User.findByUsername = function(username, callback) {
  db.sismember("overwatch:usernames", username).then(function(usernameExists) {
    if(!usernameExists)
      return callback(null, null);
    db.hgetall("overwatch:user:" + username).then(function(userData) {
      var uObj = new UserObject(username, userData);
      callback(null, uObj);
    });
  },
  function(err) {
    callback(err);
  });
};

User.register = function(username, password, callback) {
  db.sismember("overwatch:usernames", username).then(function(usernameExists) {
    if(usernameExists)
      return callback(null, false);
    var passHash = bcrypt.hashSync(password, 8);
    db.hmset("overwatch:user:" + username, {passHash: passHash}).then(function() {
      db.sadd("overwatch:usernames", username);
      User.findByUsername(username, callback);
    });
  },
  function(err) {
    callback(err);
  });
};

function UserObject(username, data) {
  this.username = username;
  this.passHash = data.passHash;
  this.checkPasswordHash = function(pass) {
    return bcrypt.compareSync(pass, this.passHash);
  };
}

module.exports = User;
