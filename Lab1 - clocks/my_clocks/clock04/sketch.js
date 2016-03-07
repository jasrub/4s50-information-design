/*
 * @name Triangle Strip
 * @description Example by Ira Greenberg. Generate a closed ring using the 
 * vertex() function and beginShape(TRIANGLE_STRIP) mode. The outsideRadius 
 * and insideRadius variables control ring's radii respectively.
 */
var x;
var y;
var outsideRadiusSeconds = 170;
var insideRadiusSeconds = 120;

function setup() {
  createCanvas(400, 400);
  background(204);
  x = width/2;
  y = height/2;
}

function draw() {
  background(204);
  
  var numPoints =int(map(second(), 0, 60, 6, 60)) ;
  var angle = 0;
  var angleStep = 180.0/numPoints;
    
  drawTriangleStrip(170, 120, int(map(second(), 0, 60, 6, 60)));
  drawTriangleStrip(110, 90, int(map(minute(), 0, 60, 6, 60)));
  drawTriangleStrip(80, 60, int(map(hour(), 0, 24, 6, 60)));
}

function drawTriangleStrip(outsideRadius, insideRadius, numPoints) {
  var angle = 0;
  var angleStep = 180.0/numPoints;
  beginShape(TRIANGLE_STRIP); 
  for (var i = 0; i <= numPoints; i++) {
    var px = x + cos(radians(angle)) * outsideRadius;
    var py = y + sin(radians(angle)) * outsideRadius;
    angle += angleStep;
    vertex(px, py);
    px = x + cos(radians(angle)) * insideRadius;
    py = y + sin(radians(angle)) * insideRadius;
    vertex(px, py); 
    angle += angleStep;
  }
  endShape();
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

