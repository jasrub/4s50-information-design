function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
}


function draw() {
  background(255);

  stroke(0);
  noFill();
  ellipseMode(RADIUS);
  
  var margin = width * 0.15;
  var left = margin;
  var right = width - margin;
  
  var hourY = height * 0.25;
  var hourLarge = 40;
  var hourSmall = 10;
  //var h = humanHour();
  var hh = hour() % 12;
  for (var i = 0; i <= hh; i++) {
    var x = map(i, 0, hh, left + hourLarge, right - hourSmall);
    var r = map(i, 0, hh, hourLarge, hourSmall);
    ellipse(x, hourY, r, r);
  }
  
  var minuteY = height * 0.5;
  var minuteLarge = 30;
  var minuteSmall = 8;
  for (var i = 0; i <= minute(); i++) {
    var x = map(i, 0, minute(), left + minuteSmall, right - minuteLarge);
    var r = map(i, 0, minute(), minuteSmall, minuteLarge);
    ellipse(x, minuteY, r, r);
  }
  
  var secondY = height * 0.75;
  var secondLarge = 15; 
  var secondSmall = 4; 
  for (var i = 0; i <= second(); i++) {
    var x = map(i, 0, second(), left + secondLarge, right - secondSmall);
    var r = map(i, 0, second(), secondLarge, secondSmall);
    ellipse(x, secondY, r, r);
  }

  noStroke();
  fill(0);
  text(nf(humanHour(), 2), margin/2, hourY);
  text(nf(minute(), 2), width - margin/2, minuteY);
  text(nf(second(), 2), margin/2, secondY);
}


// return hours that read 1 through 12 rather than 0 through 23
function humanHour() {
  var h = hour() % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}


