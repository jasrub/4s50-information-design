var buttons = [];
var backgroundColor;

function setup() {
  createCanvas(400, 200);
  backgroundColor = color(255);

  buttons[0] = new Button(width / 2 - 30, 50, 50, 50, color(255), CENTER);
  buttons[1] = new Button(width / 2 + 30, 50, 50, 50, color(150), CENTER);
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
    mode = CENTER;
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
    ellipseMode(this.mode);
    ellipse(this.x, this.y, this.w, this.h);
    pop();
  }

  this.containsCursor = function() {
    /* This function can handle all the different modes of drawing
     * ellipses. See http://p5js.org/reference/#p5/ellipseMode
     */
    switch (this.mode) {
      case CORNER:
        return sq((2 * mouseX - 2 * this.x - this.w) / this.w) +
               sq((2 * mouseY - 2 * this.y - this.h) / this.h) < 1;
      case CORNERS:
        return sq((2 * mouseX - this.x - this.w) / (this.x - this.w)) +
               sq((2 * mouseY - this.y - this.h) / (this.y - this.h)) < 1;
      case CENTER:
        return sq((mouseX - this.x) / this.w) + sq((mouseY - this.y) / this.h) < 0.25;
      case RADIUS:
        return sq((mouseX - this.x) / this.w) + sq((mouseY - this.y) / this.h) < 1;
      default:
        return false;
    }
  }
}