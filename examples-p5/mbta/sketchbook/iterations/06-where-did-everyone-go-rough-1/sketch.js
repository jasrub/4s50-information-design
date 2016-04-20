var millisInDay = 86400000;
var millisInMinute = 60000;
var binSize = 20;


var initialRadius = 40;

var stationNames = ['alewife', 'davis', 'porter', 'harvard', 'central', 'kendall'];

var traffic = {}; // global variable that holds all my data
var currRow = 0;

function findCumulative(data) {
  var startDate = new Date(data.getRow(0).getString('datetime'));
  startDate.setHours(4, 0);
  var startTime = startDate.getTime();
  startDate = new Date(startTime + 2 * millisInDay);
  print(startDate);

  var endTime = startDate.getTime() + millisInDay;

  var stationName = data.getRow(0).getString('station');
  stationName = stationName.split(" ")[0].toLowerCase();
  traffic[stationName] = {};
  var binnedCumulative = [];
  var times = []

  var localCumulative = 0;
  for (var row in data.getRows()) {
    var currTime = new Date(data.getRow(row).getString('datetime')).getTime();
    if (currTime < startDate.getTime()) {
      continue;
    } else if (currTime > endTime) {
      break;
    }
    localCumulative += (data.getRow(row).getNum('exits') - data.getRow(row).getNum('entries'));
    binnedCumulative.push(localCumulative);
    times.push(new Date(currTime));
  }

  traffic[stationName].binned = binnedCumulative;
  traffic[stationName].timestamp = times;

  print(stationName + ": " + min(binnedCumulative))
}


function setup() {
  for (var idx in stationNames) {
    loadTable("data/" + stationNames[idx] + ".csv", 'csv', 'header', findCumulative);
  }
  createCanvas(500, 500);

  noStroke();
  //frameRate(10);
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
      var x = map(idx, 0, stationNames.length - 1, width / 10, 9 * width / 10);
      var radius = initialRadius + (traffic[stationNames[idx]].binned[currRow]) / 400;
      ellipse(x, height / 2,
        radius, radius);
    }

    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    text(traffic[stationNames[0]].timestamp[currRow], 0, 0);
    currRow++;
    if (currRow >= traffic[stationNames[0]].binned.length) {
      noLoop();
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