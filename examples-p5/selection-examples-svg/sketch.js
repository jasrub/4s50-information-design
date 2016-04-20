var buttons = [];
var backgroundColor;

var SVGdata;
function preload() {
  SVGdata = loadXML('./stars.svg');
}

function setup() {
  var myCanvas = createCanvas();
  myCanvas.position(0, 0);

  var mySVG = createElement('div');
  mySVG.position(0, 0);
  mySVG.child(SVGdata.firstChild);

  myCanvas.size(mySVG.size().width, mySVG.size().height);
  backgroundColor = color(255);

  buttons = selectAll('path');
  buttons[0].style('fill', color(255));
  buttons[1].style('fill', color(150));

  buttons[0].mouseOver(function() {
    this.style('fill', color(100));
  });
  buttons[0].mouseOut(function() {
    this.style('fill', color(255));
  });
  
  buttons.forEach(function(button, idx, array) {
    button.mouseClicked(function() {
      backgroundColor = this.style('fill');
    });
  });

}

function draw() {
  background(backgroundColor);
}