var millisInDay = 86400000;
var millisInMinute = 60000;

var binSize = 20;
var filename = 'data/kendall.csv'

var traffic = []; // global variable that holds all my data
var currDayIdx = 0;

function callback(data) {
  var startDate = new Date(data.getRow(0).getString('datetime'));
  startDate.setHours(4, 0);


  var currTime = startDate.getTime();
  var currRow = 0;
  while (currRow < data.getRowCount() - 1) {

    var daily = {}
    daily.binned = [];
    daily.startTime = new Date(currTime);
    daily.entries = 0;
    daily.exits = 0;

    endTime = currTime + millisInDay;
    daily.endTime = new Date(endTime);
    while (currTime < endTime && currRow < data.getRowCount() - 1) {
      var currDate = new Date(data.getRow(currRow).getString('datetime'));
      currTime = currDate.getTime()

      var binnedTraffic = {};
      binnedTraffic.startTime = currDate;
      binnedTraffic.entries = 0;
      binnedTraffic.exits = 0;

      var binnedRow = 0;
      while (binnedRow + currRow < data.getRowCount() - 1 && binnedRow < binSize && currTime < endTime) {
        binnedTraffic.entries += data.getRow(currRow + binnedRow).getNum('entries');
        binnedTraffic.exits += data.getRow(currRow + binnedRow).getNum('exits');
        binnedRow++;
        currTime = new Date(data.getRow(currRow + binnedRow).getString('datetime')).getTime();
      }
      binnedTraffic.endTime = new Date(currTime);
      var minutesInBin = (binnedTraffic.endTime - binnedTraffic.startTime)/millisInMinute;
      binnedTraffic.entries_per_minute = binnedTraffic.entries/minutesInBin;
      binnedTraffic.exits_per_minute = binnedTraffic.exits/minutesInBin;

      daily.binned.push(binnedTraffic);
      daily.entries += binnedTraffic.entries;
      daily.exits += binnedTraffic.exits;

      currRow += binSize;
    }

    traffic.push(daily);
  }
}


function setup() {
  loadTable(filename, 'csv', 'header', callback);

  createCanvas(500, 500);

  noStroke();
  frameRate(2);
}


function draw() {
  background(255);

  if (traffic.length > 0) {
    var dailyTraffic = traffic[currDayIdx];


    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(dayOfWeek[dailyTraffic.startTime.getDay()], 0, 0);
    text(monthOfYear[dailyTraffic.startTime.getMonth()] + " " + dailyTraffic.startTime.getDate(), 0, 20);

    var binnedTraffic = dailyTraffic.binned;
    fill(0, 100);
    beginShape();
    vertex(0, height / 2);
    for (var idx in binnedTraffic) {
      x = map(binnedTraffic[idx].startTime, dailyTraffic.startTime, dailyTraffic.endTime, 0, width);
      y = map(binnedTraffic[idx].entries_per_minute, 0, 100, height / 2, 0);
      vertex(x, y);
    }
    vertex(width, height / 2);
    endShape();

    beginShape();
    vertex(0, height / 2);
    for (var idx in binnedTraffic) {
      x = map(binnedTraffic[idx].startTime, dailyTraffic.startTime, dailyTraffic.endTime, 0, width);
      y = map(binnedTraffic[idx].exits_per_minute, 0, 100, height / 2, height);
      vertex(x, y);
    }
    vertex(width, height / 2);
    endShape();

    noFill();
    stroke(0);
    beginShape();
    for (var idx in binnedTraffic) {
      x = map(binnedTraffic[idx].startTime, dailyTraffic.startTime, dailyTraffic.endTime, 0, width);
      y = map(binnedTraffic[idx].entries_per_minute - binnedTraffic[idx].exits_per_minute, -100, 100, height, 0);
      vertex(x, y);
    }
    endShape();

    currDayIdx++;
    currDayIdx %= traffic.length;
  }
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