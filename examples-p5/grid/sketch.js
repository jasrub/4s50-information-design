var grid;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = new Grid(36, // px, top margin
    36, // px, bottom margin
    36, // px, left margin
    36, // px, right margin
    4, // # columns
    12, // px, gutter width
    10 // # rows
  );
};

function draw() {
  background(255);
  
  grid.display();
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};

