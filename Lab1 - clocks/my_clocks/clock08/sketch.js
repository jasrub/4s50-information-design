function setup() {
  
}

function draw() {

createCanvas(400, 400);

noStroke();
colorMode(HSL, 60);


push();



s=5;
p=1;
scale(400 / (4*p + 3*s));

// sat = sec full color at 00
// hue = min red at 00
// val = hour black at 00

m = second();
z = minute();

c = color(m, z, hour());
fill(c);

rect(p, p, s, s);
c = color(m, z, 30);
fill(c);
rect(p+(s+p), p, s, s);

fill(m, 30, 30);
rect(p+2*(s+p), p, s, s);

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