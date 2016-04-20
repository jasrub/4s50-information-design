function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);
}


function draw() {
  background(255);
  stroke(0);
  strokeCap(SQUARE);
  
  strokeWeight(1);
  line(0, 190, map(second(), 0, 60, 0, width), 190);
  line(map(second(), 0, 60, 0, width),190, map(second(), 0, 60, 0, width), map(second(), 0, 60, 0, height))
  
  strokeWeight(3);
  line(0, 197, map(minute(), 0, 60, 0, width), 197);
  
  strokeWeight(6);
  line(0, 207, map(hour(), 0, 24, 0, width), 207);
  
  noStroke();
  text(hoursMinutesSeconds(), width/2, 230);
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