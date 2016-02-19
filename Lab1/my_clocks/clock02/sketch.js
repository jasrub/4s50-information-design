// a clock represented as 3 sand timers.
// The biggest shows the hours and the smallest show the seconds.
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  textAlign(CENTER);
  currSecond = second();
  currMinute = minute();
  currHour = hour();
  mappedSecond = map(currSecond,0,59,0,1);
  mappedHour = map(currHour,0,23,0,1);
  mappedMinute = map(currMinute,0,59,0,1);
  minuteColor = color('rgba(63, 127, 191, 0.9)');
  secondColor = color('rgba(63, 191, 191, 0.9)');
  hourColor = color('rgba(63, 63, 191,0.9)');
  drawHourGlass (0.95,mappedHour, hourColor, currHour);
  drawHourGlass (0.6, mappedMinute, minuteColor, currMinute);
  drawHourGlass (0.25, mappedSecond, secondColor, currSecond);
  
  
  text(hoursMinutesSeconds(), width/2, height - 20);
  
}

function drawHourGlass (scaleParam, progress, currColor, timeToShow) {
  push();
  translate(width/2, height/2);
  scale(scaleParam);
  stroke(0);
  noFill();
  strokeWeight(6);
  var x=5;
  //arc(width/2, 0, width, height, 0,radians(180), CHORD);
  arc(0, -height/2, width, height, 0,radians(90-x));
  arc(0, -height/2, width, height, radians(90+x),radians(180));
  arc(0, height/2, width, height ,radians(-180),radians(-90-x));
  arc(0, height/2, width, height ,radians(-90+x),0);
  line(-width/2,-height/2,width/2,-height/2);
  line(-width/2,height/2,width/2,height/2);

  strokeWeight(0);
  fill(currColor);
  arc(0, -height/2, width, height, radians(progress*90),radians(180-progress*90),CHORD);
  arc(0, height/2, width*progress, height*progress, radians(-180),0,CHORD);
  text (timeToShow, 0, -height/2);
  

  pop();
  
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