// TODO: Replace hashing with an actual hash algorithm
var redis = require('then-redis');
var db = redis.createClient();

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
      return callback(new Error("Username already exists"), null);
    db.hmset("overwatch:user:" + username, {passHash: password.length}).then(function() {
      callback(null);
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
    return pass.length == this.passHash;
  };
}

module.exports = User;
