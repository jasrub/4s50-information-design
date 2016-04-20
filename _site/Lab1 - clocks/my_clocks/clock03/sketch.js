// generate random scirbles on the screen accirding to the time.

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  secondsLines = generateLines(60,40);
  minutesLines = generateLines(60,40);
  hoursLines = generateLines (24, 40);
}


function draw() {
  background(255);
  var s = 0;
  var m = 0;
  var h = 0;
  
  stroke(0);
  for (var s=0; s<60; s++){
    if (s <second()) {
      //rotate(TWO_PI/60);
      stroke(0);
      strokeWeight(2)
      line(secondsLines[0][s], secondsLines[1][s], secondsLines[0][s+1], secondsLines[1][s+1]);
      if (second()%59==0) {
        secondsLines = generateLines(60,40)
      }
    }
    if (s<minute()) {
      stroke (100);
      strokeWeight(4)
      line(minutesLines[0][s], minutesLines[1][s], minutesLines[0][s+1], minutesLines[1][s+1]);
    }
    if (s<humanHour()) {
      stroke (150);
      strokeWeight(8)
      line(hoursLines[0][s], hoursLines[1][s], hoursLines[0][s+1], hoursLines[1][s+1]);
    }
  }
  
  noStroke();
  fill(0);
  // adds 1 to y so that it centers a little better
  text(hoursMinutesSeconds(), width/2, height/2 + 1);
}

function generateLines (linesNumber, linesLength) {
  linesArray = [];
  randomAngles = [];
  for (var i=0; i<linesNumber; i++){
    randomAngles[i] = random(360);
  }
  linesArray[0] = [];
  linesArray[1] = [];
  linesArray[0][0] = random(width);
  linesArray[1][0] = random(height);
  for (var i=1; i<linesNumber; i++){
    var randAngle = random(360);
    newX = linesArray[0][i-1]+linesLength * cos(radians(randAngle));
    newY = linesArray[1][i-1]+linesLength * sin(radians(randAngle));
    while (newX>width || newX<0 || newY>height || newY<0) {
      randAngle = random(360);
      newX = linesArray[0][i-1]+linesLength * cos(radians(randAngle));
      newY = linesArray[1][i-1]+linesLength * sin(radians(randAngle));
    }
    linesArray[0][i] = newX;
    linesArray[1][i] = newY;
  }
  return linesArray
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

