var t = []

function draw() {

  createCanvas(400, 400);

  noStroke();

  fill(18);

  textAlign(LEFT, TOP);

  textFont("consolas");
  //text(s, 1, 1, 400, 400); // Text wraps within text box

  h = 15;

  for (i = 0; i < 12; i++) {
    isit = i + 1 == humanHour();
    fill(isit ? 0 : 200)
    text(t[i + 1] + (isit ? '\t&' : ''), 10, h * i);
  }

  x = 20;
  for (i = 1; i < 60; i++) {
    isit = i == minute();
    fill(isit ? 0 : 200);
    j=i-minute() + humanHour() - 1;
    
    if(j < 0) j+= 60;
    
    text(t[i], 100 * ceil((j+1)/x), 15 * (j%x));
  }
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

function setup() {
  t = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',

    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'ninteen',
    'twenty',
    'twenty one',
    'twenty two',
    'twenty three',
    'twenty four',


    'twenty five',
    'twenty six',
    'twenty seven',
    'twenty eight',
    'twenty nine',
    'thirty',
    'thirty one',
    'thirty two',
    'thirty three',
    'thirty four',
    'thirty five',
    'thirty six',

    'thirty seven',
    'thirty eight',
    'thirty nine',
    'forty',
    'forty one',
    'forty two',
    'forty three',
    'forty four',
    'forty five',
    'forty six',
    'forty seven',
    'forty eight',

    'forty nine',
    'fifty',
    'fifty one',
    'fifty two',
    'fifty three',
    'fifty four',
    'fifty five',
    'fifty six',
    'fifty seven',
    'fifty eight',
    'fifty nine',
  ]
}