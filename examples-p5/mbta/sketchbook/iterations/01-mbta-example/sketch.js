var millisInDay = 86400000;

var filename = 'data/kendall.csv'
var turnstile;

// Table Reset //
var startDate;
var endTime;
var currRow;

function resetTable() {
  startDate = new Date(turnstile.getRow(0).getString('datetime'));
  startDate.setHours(4, 0);

  endTime = startDate.getTime() + millisInDay;
  currRow = 0;
}
// //


function preload() {
  turnstile = loadTable(filename, 'csv', 'header');
}


function setup() {
  createCanvas(500, 500);
  resetTable();

  noStroke();
  frameRate(2);
}


function draw() {
  background(255);

  startDate.setTime(endTime);
  endTime = startDate.getTime() + millisInDay;

  var currTime = startDate.getTime();
  var traffic = [];
  while (currTime < endTime && currRow < turnstile.getRowCount() - 1) {
    var dailyTraffic = {
      entries: turnstile.getRow(currRow).getNum('entries'),
      exits: turnstile.getRow(currRow).getNum('exits')
    }
    traffic.push(dailyTraffic);

    currRow++;
    var currDate = new Date(turnstile.getRow(currRow).getString('datetime'));
    currTime = currDate.getTime();
  }

  if (currRow >= turnstile.getRowCount() - 1) {
    resetTable();
  }


  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text(dayOfWeek[startDate.getDay()], 0, 0);
  text(monthOfYear[startDate.getMonth()] + " " + startDate.getDate(), 0, 20);


  fill(0, 100);
  beginShape();
  vertex(0, height / 2);
  for (var idx in traffic) {
    x = map(idx, 0, traffic.length, 0, width);
    y = map(traffic[idx].entries, 0, 100, height / 2, 0);
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape();

  beginShape();
  vertex(0, height / 2);
  for (var idx in traffic) {
    x = map(idx, 0, traffic.length, 0, width);
    y = map(traffic[idx].exits, 0, 100, height / 2, height);
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape();
  
  noFill();
  stroke(0);
  beginShape();
  for (var idx in traffic) {
    x = map(idx, 0, traffic.length, 0, width);
    y = map(traffic[idx].entries - traffic[idx].exits, -100, 100, height, 0);
    vertex(x,y);
  }
  endShape();
}


// Start and Stop Animation //
var looping = true;

function mouseClicked() {
  looping ? noLoop() : loop();
  looping = !looping;
}
// //


var dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

var monthOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];