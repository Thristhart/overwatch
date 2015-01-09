var CustomErrors = {};

CustomErrors.UnknownEntityID = function(message) {
  this.name = 'UnknownEntityID';
  this.message = message;
};
CustomErrors.UnknownEntityID.prototype = new Error();
CustomErrors.UnknownEntityID.constructor = CustomErrors.UnknownEntityID;

module.exports = CustomErrors;
