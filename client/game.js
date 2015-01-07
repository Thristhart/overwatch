var io = require('socket.io-client');
window.addEventListener("load", function() {
  var socket = io({path: "/overwatch/socket.io/"});
  socket.on('connect', function() {
    socket.emit("ping");
  });
});
