var Entities = {};
var Err = require('./errors.js');

Entities.lookup = {};

Entities.serverUpdate = function(message) {
  return Entities.findById(message.id).catch(function(err) {
    if(err instanceof Err.UnknownEntityID) {
      return Entities.create(message);
    }
  }).then(function(ent) {
    return Entities.clone(message, ent);
  });
};
Entities.findById = function(id) {
  return new Promise(function(resolve, reject) {
    var ent = Entities.lookup[id];
    if(ent) {
      resolve(ent);
    }
    else {
      reject(new Err.UnknownEntityID("No entity with id " + id));
    }
  });
};
Entities.create = function(values) {
  var newEnt = {};
  newEnt.x = 0;
  newEnt.y = 0;
  newEnt.render = false;


  Entities.clone(values, newEnt);
  
  if(!newEnt.id) {
    throw new Err.UnknownEntityID("No entity id specified");
  }

  lookup[newEnt.id] = newEnt;
};

Entities.clone = function(baseEnt, targetEnt) {
  for(var prop in baseEnt) {
    targetEnt[prop] = baseEnt[prop];
  }
  return targetEnt;
};

module.exports = Entities;
