var express = require('express');
var app = express();
var router = require('./routes');

app.use('/overwatch', router);

var port = 5500;

app.listen(port);
