function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  textAlign(CENTER);

  push();
  translate(width/2, height/2);
  noFill();
  stroke(0);

  push();  
  strokeWeight(8);
  var hourSize = 90;
  var hourAngle = map(hour() % 12,  0, 12,  0, TAU);
  rotate(hourAngle);
  triangle(0, -hourSize,  hourSize, 0,  -hourSize, 0);
  noStroke();
  fill(0);
  ellipse(0, -hourSize, 25, 25);
  pop();
  
  push();
  strokeWeight(4);
  var minuteSize = 120;
  var minuteAngle = map(minute(),  0, 60,  0, TAU);
  rotate(minuteAngle);
  triangle(0, -minuteSize,  minuteSize, 0,  -minuteSize, 0);
  noStroke();
  fill(0);
  ellipse(0, -minuteSize, 15, 15);
  pop();

  push();
  strokeWeight(2);
  var secondSize = 150;
  var secondAngle = map(second(),  0, 60,  0, TAU);
  rotate(secondAngle);
  triangle(0, -secondSize,  secondSize, 0,  -secondSize, 0);
  noStroke();
  fill(0);
  ellipse(0, -secondSize, 7, 7);
  pop();
  
  fill(255);
  noStroke();
  ellipse(0, 0, 50, 50);
  pop();

  noStroke();
  fill(0);
  // adds 1 to y so that it centers a little better
  text(hoursMinutesSeconds(), width/2, height - 20);
}


// return hours that read 1 through 12 rather than 0 through 23
function humanHour() {
  var h = hour() % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}


// format hours and minutes
function hoursMinutes() {
  return nf(humanHour(), 2) + ':' + nf(minute(), 2);
}


// format hours, minutes, and seconds
function hoursMinutesSeconds() {
  return hoursMinutes() + ':' + nf(second(), 2);
}
