// show the time that has passed since begining of the day as white noise.
// each pixel will be colored black with the probability of the number of seconds that has
// elapsed since the begining of the day.
var secondsInDay = 86400;
var secondsInHour = 3600;
var secondsInMinute = 60;
var rand = [];
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  noStroke();
  var elapsedSeconds = second()+minute()*secondsInMinute+hour()*secondsInHour;
  var probability = elapsedSeconds/secondsInDay;
  // uncomment next line to see fast progress
  //probability = second()/60;
  for (var i=0; i<width/5; i++) {
    for (var j=0; j<height/5; j++) {
      rand = random();
      if (rand<probability) {
        fill(0);
      }
      else {
        fill (255);
      }
      rect(i*5,j*5,5,5)
    }
  }
}

/** @return the greatest common denominator */
function gcm(a, b) {
    return b == 0 ? a : gcm(b, a % b); 
}