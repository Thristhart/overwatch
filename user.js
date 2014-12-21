// TODO: Replace with a database model and an actual hashing algorithm

var User = {};


var store = {"tom": {passHash: 5}};

User.findByUsername = function(username, callback) {
  if(!store[username])
    callback(null, null);
  callback(null, new UserObject(username, store[username]));
};

function UserObject(username, data) {
  this.username = username;
  this.passHash = data.passHash;
  this.checkPasswordHash = function(pass) {
    return pass.length == this.passHash;
  };
}

module.exports = User;
