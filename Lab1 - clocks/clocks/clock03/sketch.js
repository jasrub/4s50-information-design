function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  
  var hourSize = height/6;
  var hourX = width*0.2 - hourSize;
  var hourY = 0; 
  var h = hour() % 12;
  for (var i = 0; i < h; i++) {
    hourY -= hourSize;
    if (hourY < 0) {
      // start back at the bottom
      hourY = height - hourSize/2;
      // move one step to the right
      hourX += hourSize;
    }
    ellipse(hourX, hourY, hourSize, hourSize);
  }
  
  var minuteSize = height/30;
  var minuteX = width*0.55;
  //var minuteX = 2*width/3 - minuteSize;
  var minuteY = 0;
  for (var i = 0; i < minute(); i++) {
    minuteY -= minuteSize;
    if (minuteY < 0) {
      minuteY = height - minuteSize/2;
      minuteX += minuteSize;
    }
    ellipse(minuteX, minuteY, minuteSize, minuteSize);
  }
  
  var secondSize = height/60;
  var secondX = width*0.85 - secondSize/2;
  var secondY = height - secondSize/2;
  for (var i = 0; i < second(); i++) {
    ellipse(secondX, secondY, secondSize, secondSize);
    secondY -= secondSize;
  }
}