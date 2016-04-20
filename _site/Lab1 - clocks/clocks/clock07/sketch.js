function setup() {
  createCanvas(400, 400);
}


function draw() {
  background(255);
  fill(0);
  noStroke();
  ellipseMode(RADIUS);

  var startAngle = radians(-90);
  var stopAngle = radians(270);
  
  push();
  translate(width/2, height/2);
  var angle = map(minute(), 0, 60, startAngle, stopAngle);
  rotate(angle);  // start on the minute position
  stroke(0);
  line(-width, 0, width, 0);  // arbitrarily large
  var each = TAU / 120;  // each step is 1/120th of the circle
  for (var i = 0; i < second(); i++) {
    rotate(each);
    line(-width, 0, width, 0);
  }
  pop();

  noStroke();
  fill(0);
  text(hoursMinutesSeconds(), 20, 30);
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