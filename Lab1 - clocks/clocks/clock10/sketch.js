function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
}


function draw() {
  background(255);
  
  stroke(0);
  // draw horizontal lines for the first 30 seconds
  for (var i = 0; i < 30; i++) {
    if (i <= second()) {
      var y = (i+1) * height/31;
      line(0, y, width, y);
    }
  }
  // next draw vertical lines
  for (var i = 0; i < 30; i++) {
    if (i+30 <= second()) {
      var x = (i+1) * width/31;
      line(x, 0, x, height);
    }
  }
  
  noStroke();
  fill(0);
  // adds 1 to y so that it centers a little better
  text(hoursMinutesSeconds(), width/2, height/2 + 1);
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

