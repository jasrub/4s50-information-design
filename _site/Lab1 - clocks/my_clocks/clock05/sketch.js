function setup() {
    createCanvas(400, 400);
}
function draw() {
  var h = int(map(hour(), 0, 24, 0, 255));
  var m = int(map (minute(), 0, 60, 0, 255));
  var s = int(map (second() , 0 ,60,0, 255));
  var c = color(h,m,s);
  background(c);
  hexCode = "#"+hex(h,2)+hex(m,2)+hex(s,2);
  
  textAlign(CENTER, CENTER);
  textSize (width/10);
  textStyle(BOLD);
  textFont("consolas");
  fill(color('rgba(255,255,255,0.8)'))
  noStroke();
  text(hexCode, width/2, height/2);
  
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


