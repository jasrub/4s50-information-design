function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  stroke(0);

  // where to start drawing boxes
  var y = height * 0.4;

  var hourBetween = 4;
  var hourSize = (width - hourBetween * 11) / 12;
  h = hour() % 12;
  for (var i = 0; i < 12; i++) {
    if (i <= h) {
      fill(0);
    } else {
      noFill();
    }
    var x = (hourSize + hourBetween) * i;
    rect(x, y, hourSize, hourSize);
  }
  // move down a row
  y += hourSize + hourBetween;

  var minuteBetween = 4;
  var minuteSize = (width - minuteBetween * 19) / 20;
  var x = 0;
  for (var i = 0; i < 60; i++) {
    if (i <= minute()) {
      fill(0);
    } else {
      noFill();
    }
    rect(x, y, minuteSize, minuteSize);
    x += minuteSize + minuteBetween;
    if (x >= width) {
      x = 0;
      y += minuteSize + minuteBetween;
    }
  }

  // nearly identical to minutes loop
  var secondBetween = 2;
  var secondSize = (width - secondBetween * 29) / 30;
  x = 0;
  for (var i = 0; i < 60; i++) {
    if (i <= second()) {
      fill(0);
    } else {
      noFill();
    }
    rect(x, y, secondSize, secondSize);
    x += secondSize + secondBetween;
    if (x >= width) {
      x = 0;
      y += secondSize + secondBetween;
    }
  }
}


// return hours that read 1 through 12 rather than 0 through 23
function humanHour() {
  var h = hour() % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}