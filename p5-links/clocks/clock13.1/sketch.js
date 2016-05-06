// Same as clock 13- white noise. 
//but now with column for hours, for minutes and for seconds (seconds on the left)
var secondsInDay = 86400;
var secondsInHour = 3600;
var secondsInMinute = 60;
var hours = 34;
var minutes = 60;
var rand = [];
function setup() {
  createCanvas(400, 400);
  // for (var i=0; i<width/5; i++) {
  //   rand[i] = [];
  //   for (var j=0; j<height/5; j++) {
  //     rand[i][j] = random();
  //   }
  // }
}

function draw() {
  background(255);
  noStroke();
  var elapsedSeconds = second()+minute()*secondsInMinute+hour()*secondsInHour;
  var probability = elapsedSeconds/secondsInDay;
  // uncomment next line to see fast progress
  probabilitySecond = second()/60;
  probabilityMinute  = minute()/60;
  probabiltyHour = hour()/24;
  var pixelSize = 5
  for (var i=0; i<(width/3)/pixelSize; i++) {
    for (var j=0; j<height/pixelSize; j++) {
      rand = random();
      if (rand<probabilitySecond) {
        fill(0);
      }
      else {
        fill (255);
      }
      rect(i*pixelSize,j*pixelSize,pixelSize,pixelSize)
    }
  }
  for (var i=(width/3)/pixelSize; i<(width/3)/pixelSize*2; i++) {
    for (var j=0; j<height/pixelSize; j++) {
      rand = random();
      if (rand<probabilityMinute) {
        fill(0);
      }
      else {
        fill (255);
      }
      rect(i*pixelSize,j*pixelSize,pixelSize,pixelSize)
    }
  }
  for (var i=(width/3)/pixelSize*2; i<width/pixelSize; i++) {
    for (var j=0; j<height/pixelSize; j++) {
      rand = random();
      if (rand<probabiltyHour) {
        fill(0);
      }
      else {
        fill (255);
      }
      rect(i*pixelSize,j*pixelSize,pixelSize,pixelSize)
    }
  }
}

/** @return the greatest common denominator */
function gcm(a, b) {
    return b == 0 ? a : gcm(b, a % b); 
}