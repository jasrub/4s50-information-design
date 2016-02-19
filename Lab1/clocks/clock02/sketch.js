function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  fill(0);
  noStroke();
  textAlign(CENTER);

  var startAngle = radians(-90);
  var stopAngle = radians(270);
  
  var y = height/2;
  var each = width/3;
  var textY = height*0.8;
  
  var hourCenter = width/6;
  var hourAngle = map(hour() % 12, 0, 12, startAngle, stopAngle);
  arc(hourCenter, y, each, each, startAngle, hourAngle);
  text(nf(humanHour(), 2), hourCenter, textY);
  
  var minuteCenter = width/2;
  var minuteAngle = map(minute(), 0, 60, startAngle, stopAngle);
  arc(minuteCenter, y, each, each, startAngle, minuteAngle);
  text(nf(minute(), 2), minuteCenter, textY);
  
  var secondCenter = 5*width/6;
  var secondAngle = map(second(), 0, 60, startAngle, stopAngle);
  arc(secondCenter, y, each, each, startAngle, secondAngle);
  text(nf(second(), 2), secondCenter, textY);
}


// return hours that read 1 through 12 rather than 0 through 23
function humanHour() {
  var h = hour() % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}

