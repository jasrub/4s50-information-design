// Shows the second elapsed as a fraction.
// Updates the fraction only if the bottom number is less than 4 digits
var secondsInDay = 86400;
var secondsInHour = 3600;
var secondsInMinute = 60;
var currTop = 0;
var currBottom = 0;
function setup() {
  createCanvas(400, 400);
  
}

function draw() {
  background(255);
  var elapsedSeconds = second()+minute()*secondsInMinute+hour()*secondsInHour;
  var foundGcm = gcm(elapsedSeconds,secondsInDay);
  var topNum = elapsedSeconds / foundGcm;
  var bottomNum = secondsInDay / foundGcm;
  if (bottomNum < 9999) {
    currTop = topNum;
    currBottom = bottomNum;
  }
  lineSize=width/8;
  line (width/2-lineSize, height/2, width/2+lineSize, height/2);
  textSize(40)
  textStyle (BOLD);
  textAlign(CENTER, BOTTOM);
  text(currTop,width/2, height/2)
  textAlign(CENTER, TOP);
  text(currBottom,width/2, height/2)
  stroke(0);
  
  fill(0)
  mappedValue  = map(currTop, 0, currBottom, radians(-90), radians(270))
  arc(width/2,height/2+50, 100,100,0,radians(360));
  //fill(255)
  //arc (width/2, height/2+100, 100, 100,0, mappedValue, PIE )
  
  
}

/** @return the greatest common denominator */
function gcm(a, b) {
    return b == 0 ? a : gcm(b, a % b); 
}