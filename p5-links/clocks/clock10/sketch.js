var t = []
function setup() {
    createCanvas(400, 400);

}
function draw() {
  background(255);
  fill(0);

  ml = millis() % 1000;

  N=150;

  ms = N/2+N/2 * (1-sin(2*PI * (ml/1000 + 500)))
  ellipse(50, ms, 10, 10)

  s = N/2 + N/2 * (1-sin(2*PI * second()/60));
  ellipse(150, s, 30, 30);

  m = N/2 + N/2 * (1-sin(2*PI * minute()/60));
  ellipse(250, m, 50, 50);

  h = N/2 + N/2 * (1-sin(2*PI * hour()/60));
  ellipse(350, h, 70, 70);



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