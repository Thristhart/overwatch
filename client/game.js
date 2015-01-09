var io = require('socket.io-client');
var render = require('./render');
window.addEventListener("load", function() {
  render.setupCanvas();
  var socket = io({path: "/overwatch/socket.io/"});
  socket.on('connect', function() {
    socket.emit("ping");
    console.log("Connected successfully");
  });
  socket.on('entUpdate', function(message) {
    Entities.serverUpdate(message);
  });
  socket.on('error', function(err) {
    console.log(err);
  });
});
window.addEventListener("resize", function() {
  render.fitCanvasToWindow();
});
