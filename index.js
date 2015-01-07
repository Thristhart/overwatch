var express = require('express');
var nunjucks = require('nunjucks');

var app = express();
var router = require('./routes');

app.use('/overwatch', router);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});


var port = 5500;

var http = require('http');
var server = http.createServer(app);

require('./sockets.js').attach(server);

server.listen(port);
