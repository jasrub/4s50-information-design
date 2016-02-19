var n = 360;
var secondsLengths = new Array(n);
var minutesLengths = new Array(n);
var hoursLengths = new Array(n);

function setup() {
  createCanvas(400, 400);
  for (var i = 0; i < secondsLengths.length; i++) {
    secondsLengths[i] = random(130,195);
    minutesLengths[i] = random(70,140);
    hoursLengths[i] = random(30,80);
  }
}

function draw() {
  background(204);
  push();
 translate(width/2, width/2);
 for (var i = 0; i < secondsLengths.length; i++) {
    if (i<=map(second(), 0, 60, 0, secondsLengths.length-radians(90))) {
      push();
      rotate(radians(i-90));
      stroke(255);
      strokeWeight(1);
      var dist = abs(secondsLengths[i]);
      line(0, 0, dist, 0);
      pop();
    }
    if (i<=map(minute(), 0, 60, 0, minutesLengths.length-radians(90))) {
      push();
      rotate(radians(i-90));
      stroke(150);
      strokeWeight(3);
      var dist = abs(minutesLengths[i]);
      line(0, 0, dist, 0);
      pop();
    }
    if (i<=map(hour(), 0, 24, 0, hoursLengths.length)) {
      push();
      rotate(radians(i-90));
      stroke(0);
      strokeWeight(5);
      var dist = abs(hoursLengths[i]);
      line(0, 0, dist, 0);
      pop();
    }
  }
  pop();
}