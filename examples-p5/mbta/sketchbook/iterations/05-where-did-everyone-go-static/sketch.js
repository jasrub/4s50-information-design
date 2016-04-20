var millisInDay = 86400000;
var millisInMinute = 60000;

var binSize = 20;
var stationNames = ['alewife', 'davis', 'porter', 'harvard', 'central', 'kendall'];

var traffic = {}; // global variable that holds all my data
var currDayIdx = 0;

function callback(data) {
  var stationName = data.getRow(0).getString('station');
  stationName = stationName.split(" ")[0].toLowerCase()
  traffic[stationName] = [];
  traffic[stationName].entries = 0;
  traffic[stationName].exits = 0;
  
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

    traffic[stationName].push(daily);
    traffic[stationName].entries+=daily.entries;
    traffic[stationName].exits+=daily.exits;
  }
}


function setup() {
  for (var idx in stationNames) {
    loadTable("data/" + stationNames[idx] + ".csv", 'csv', 'header', callback);
  }
  createCanvas(500, 500);

  noStroke();
  frameRate(2);
}


function draw() {
  background(255);

  strokeWeight(10);
  stroke(255, 0, 0);
  line(width / 10, height / 2, 9 * width / 10, height / 2);
  
  
  if (Object.keys(traffic).length == stationNames.length) {
  strokeWeight(1);
  for (var idx in stationNames) {
    stroke(255, 0, 0);
    var x = map(idx, 0, stationNames.length-1, width/10, 9*width/10)
    var radius = sqrt(traffic[stationNames[idx]].entries)/11;
    var smallradius = sqrt(traffic[stationNames[idx]].exits)/11;
   ellipse(x, height/2,
   radius, radius);
   stroke(100, 0, 0);
   ellipse(x, height/2, smallradius, smallradius);
  }
  }
  
}