// A clock inspired from the P5.js Spirograph example.
//<a href='http://en.wikipedia.org/wiki/Spirograph'>http://en.wikipedia.org/wiki/Spirograph</a>

var screenCenter;


function setup() {
  createCanvas(400, 400);
  screenCenter = createVector(width/2, height/2);

  ellipseMode(RADIUS);
  noStroke();
}


function draw() {
  rad = width/4;
  var i = 0;
  background(255);
  stroke(0);
  noFill();
  strokeWeight(8);
  stroke(color('#157CE8'));
  ellipse(screenCenter.x, screenCenter.y, rad, rad);

  //Draw hour circle
  strokeWeight(6);
  stroke(color('#24D3FF'));
  hourCenter = analogClock(hour() % 12, 12, screenCenter, rad);
  i++;
  ellipse(hourCenter.x, hourCenter.y, rad/(i+1), rad/(i+1));
  
  //Draw minute Circle
  strokeWeight(4);
  stroke(color('#15E8CF'));
  minuteCenter = analogClock(minute(), 60, hourCenter, rad/(i+1));
  i++;
  ellipse(minuteCenter.x, minuteCenter.y, rad/(i+1), rad/(i+1));
  
  //Draw second circle
  strokeWeight(2);
  stroke(color('#17FF96'));
  secondCenter = analogClock(second(), 60, minuteCenter, rad/(i+1));
  i++;
  ellipse(secondCenter.x, secondCenter.y, rad/(i+1), rad/(i+1));

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text (hoursMinutesSeconds(), width/2, height-20);
}


function analogClock(value, high, mid, radius) {
  var angle = map(value, 0, high, radians(-90), radians(270));
  return createVector(mid.x + cos(angle)*radius, mid.y + sin(angle)*radius);
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