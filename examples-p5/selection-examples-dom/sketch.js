var buttons = [];
var backgroundColor;

function setup() {
  createCanvas(400, 200);
  backgroundColor = color(255);
  
  buttons[0] = new Button(width/2 - 55, 25, 50, 50, color(255));
  buttons[1] = new Button(width/2 + 5, 25, 50, 50, color(150));
  
  buttons[0].mouseOver(function() {
    this.style('background-color', color(100));
  });
  buttons[0].mouseOut(function() {
    this.style('background-color', color(255));
  });
  
  buttons.forEach(function(button, idx, array) {
    button.mouseClicked(function() {
      backgroundColor = this.style('background-color');
    });
  });
}

function draw() {
  background(backgroundColor);
}

//------------------------------//

function Button(x, y, w, h, c) {
  element = createElement();
  element.position(x, y);
  element.size(w, h);
  element.style('background-color', c);
  element.style('border', '1px solid black')
  
  return element;
}