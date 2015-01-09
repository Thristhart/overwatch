var Render = {};
var canvas;
var context;


Render.drawObject = function(obj) {
};
Render.setupCanvas = function() {
  canvas = document.getElementById("display");
  context = canvas.getContext("2d");
  Render.fitCanvasToWindow();
};
Render.fitCanvasToWindow = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

module.exports = Render;
