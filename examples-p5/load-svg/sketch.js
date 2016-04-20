var SVGdata;
function preload() {
  SVGdata = loadXML('./map.svg'); // loadXML('./stars.svg');
}

function setup() {
  var myCanvas = createCanvas();
  myCanvas.position(0, 0);

  var mySVG = createElement('div');
  mySVG.position(0, 0);
  mySVG.child(SVGdata.firstChild);

  myCanvas.size(mySVG.size().width, mySVG.size().height);

  var buttons = selectAll('path');
  
  buttons.forEach(function(button, idx, array) {
    button.mouseClicked(function() {
      print(this.id() + " clicked");
    });
  });
}

function draw() {
  background(0);
}