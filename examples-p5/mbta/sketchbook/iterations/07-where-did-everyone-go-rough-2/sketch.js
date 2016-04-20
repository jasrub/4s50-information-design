var millisInDay = 86400000;
var millisInMinute = 60000;

var binSize = 1; // bin size in minutes
var initialRadius = 40;

var stationNames = ['alewife', 'davis', 'porter', 'harvard', 'central', 'kendall'];
var stationsLoaded = 0;

var traffic = []; // global variable that holds all my data
var currRow = 0;

function findCumulative(data) {
  var stationName = data.getRow(0).getString('station').split(' ')[0].toLowerCase();

  var cumulative = 0;
  
  var timeIdx = 0;
  for (var row in data.getRows()) {
    var currDate = new Date(data.getRow(row).getString('datetime'));
    if (currDate.getTime() < traffic[timeIdx].startTime.getTime()) {
      continue;
    }
    else if (currDate.getTime() > traffic[timeIdx].endTime.getTime()) {
      traffic[timeIdx][stationName] = cumulative;
      cumulative+=(data.getRow(row).getNum('exits') - data.getRow(row).getNum('entries'));
      timeIdx++;
      if (timeIdx >= traffic.length) {
        break;
      }
    }
    else {
      cumulative+=(data.getRow(row).getNum('exits') - data.getRow(row).getNum('entries'));
    }
  }
  stationsLoaded++;
}

function setup() {
  // Set up timestamps //
  var startDate = new Date('2014-02-04 04:00:00');
  var endDate = new Date('2014-02-05 04:00:00');

  for (var currTime = startDate.getTime(); currTime < endDate.getTime(); currTime += binSize * millisInMinute) {
    var trafficObject = {};
    trafficObject.startTime = new Date(currTime);
    trafficObject.endTime = new Date(currTime + binSize * millisInMinute);
    traffic.push(trafficObject);
  }
  // //

  // Add data //
  for (var idx in stationNames) {
    loadTable("data/" + stationNames[idx] + ".csv", 'csv', 'header', findCumulative);
  }
  // //
  
  createCanvas(500, 500);
}

function draw() {
  background(255);

  strokeWeight(10);
  stroke(255, 0, 0);
  line(width / 10, height / 2, 9 * width / 10, height / 2);

  if (stationsLoaded == stationNames.length) {
    strokeWeight(1);
    for (var idx in stationNames) {
      stroke(255, 0, 0);
      var x = map(idx, 0, stationNames.length - 1, width / 10, 9 * width / 10);
      var radius = initialRadius + (traffic[currRow][stationNames[idx]]) / 400;
      ellipse(x, height / 2,
        radius, radius);
    }
    
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    text(traffic[currRow].startTime, 0, 0);
    currRow++;
    if (currRow >= traffic.length) {
      currRow = 0;
    }
  }
}

// Start and Stop Animation //
var looping = true;

function mouseClicked() {
  looping ? noLoop() : loop();
  looping = !looping;
}
// //