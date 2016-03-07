var t = []

function draw() {

createCanvas(400, 400);

noStroke();

fill(18);

textAlign(LEFT, TOP);

textFont("consolas");
//text(s, 1, 1, 400, 400); // Text wraps within text box

s="";
s+="it\'s "+ t[humanHour()] + " o\'clock\n";
s+= t[minute()] + " minutes\n";
s+= "and "+ t[second()] + " seconds\n";

text(s, 11, 11);

  
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