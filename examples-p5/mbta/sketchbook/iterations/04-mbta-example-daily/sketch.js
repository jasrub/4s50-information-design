var millisInDay = 86400000;
var millisInMinute = 60000;

var binSize = 18;
var filename = 'data/kendall.csv';

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
      var minutesInBin = (binnedTraffic.endTime - binnedTraffic.startTime) / millisInMinute;
      binnedTraffic.entries_per_minute = binnedTraffic.entries / minutesInBin;
      binnedTraffic.exits_per_minute = binnedTraffic.exits / minutesInBin;

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
    var diffs_normalized = [];
    for (var idx in traffic) {
        diffs_normalized.push(100*(traffic[idx].entries - traffic[idx].exits)/
                              (traffic[idx].entries + traffic[idx].exits));
    }
    
    strokeWeight(5);
    for (var idx in diffs_normalized) {
      var x = map(idx, 0, diffs_normalized.length, 0, width);
      var y = map(diffs_normalized[idx], -100, 100, height, 0)
      
      if (traffic[idx].startTime.getDay() == 1)  {// If it's a Monday
        stroke(0);
      }
      else {
        stroke(150);
      }
      line(x, height/2, x, y);
    }
    
    noStroke();
    fill(0);
    textSize(15);
    textAlign(RIGHT, TOP);
    
    var inOutStr = max(diffs_normalized) > 0 ? "in than out" : "out than in";
      text("max: " + nfs(abs(max(diffs_normalized)), 2, 1) + "% of daily traffic more " + inOutStr, width, 0);
    
    inOutStr = min(diffs_normalized) > 0 ? "in than out" : "out than in";
    textAlign(RIGHT, BOTTOM);
    text("min: " + nfs(abs(min(diffs_normalized)), 2, 1) + "% of daily traffic more " + inOutStr, width, height);
    
  }
}