var buttons = [];
var backgroundColor;

function setup() {
  createCanvas(400, 200);
  backgroundColor = color(255);

  buttons[0] = new Button(width / 2 - 55, 25, 50, 50, color(255), CORNER);
  buttons[1] = new Button(width / 2 + 5, 25, 50, 50, color(150), CORNER);
}

function draw() {
  background(backgroundColor);

  if (buttons[0].containsCursor()) {
    buttons[0].c = color(100);
  } else {
    buttons[0].c = color(255);
  }

  // Draw the buttons
  buttons.forEach(function(button, idx, array) {
    button.display();
  });
}

function mouseClicked() {
  buttons.forEach(function(button, idx, array) {
    if (button.containsCursor()) {
      backgroundColor = button.c;
      return;
    }
  });
}

//-----------------------------------//

function Button(x, y, w, h, c, mode) {
  if (!mode) {
    mode = CORNER;
  }

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.c = c;
  this.mode = mode;

  this.display = function() {
    push();
    fill(this.c);
    stroke(0);
    rectMode(this.mode);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  this.containsCursor = function() {
    /* This function can handle all the different modes of drawing
     * rects. See http://p5js.org/reference/#p5/rectMode
     */
    switch (this.mode) {
      case CORNER:
        return (mouseX > this.x && mouseX < this.x + this.w) &&
          (mouseY > this.y && mouseY < this.y + this.h);
      case CORNERS:
        return (mouseX > this.x && mouseX < this.w) &&
          (mouseY > this.y && mouseY < this.h);
      case CENTER:
        return (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2) &&
          (mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2);
      case RADIUS:
        return (mouseX > this.x - this.w && mouseX < this.x + this.w) &&
          (mouseY > this.y - this.h && mouseY < this.y + this.h);
      default:
        return false;
    }
  }
}