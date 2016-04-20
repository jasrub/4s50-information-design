var millisInDay = 86400000;
var millisInMinute = 60000;

var binSize = 1; // bin size in minutes
var initialRadius = 40;
var personPerRadiusPixel = 400;

var startDate = new Date('2014-02-04 04:00:00');
var endDate = new Date('2014-02-05 02:00:00');

var stationNames = ['alewife', 'davis', 'porter', 'harvard', 'central', 'kendall'];
var stationsLoaded = 0;

var traffic = []; // global variable that holds all the data
var currTimeIdx = 0;

function findCumulative(data) {
  var stationName = data.getRow(0).getString('station').split(' ')[0].toLowerCase();

  var cumulative = 0;
  var timeIdx = 0;
  for (var row in data.getRows()) {
    var currDate = new Date(data.getRow(row).getString('datetime'));
    if (currDate.getTime() < traffic[timeIdx].startTime.getTime()) {
      continue;
    } else if (currDate.getTime() > traffic[timeIdx].endTime.getTime()) {
      traffic[timeIdx][stationName] = cumulative;
      if (currDate.getTime() < endDate.getTime()) {
        cumulative += (data.getRow(row).getNum('exits') - data.getRow(row).getNum('entries'));
      }
      timeIdx++;
      if (timeIdx >= traffic.length) {
        break;
      }
    } else {
      cumulative += (data.getRow(row).getNum('exits') - data.getRow(row).getNum('entries'));
    }
  }
  stationsLoaded++;
}

function setup() {
  // Set up timestamps //
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

  // Draw the Red Line as... a red line //
  strokeWeight(10);
  stroke(255, 0, 0);
  line(width / 10, height / 3, 9 * width / 10, height / 3);
  // //

  // Draw the stations //
  if (stationsLoaded == stationNames.length) {
    strokeWeight(1);
    for (var idx in stationNames) {
      push();
      var x = map(idx, 0, stationNames.length - 1, width / 10, 9 * width / 10);
      translate(x, height / 3);
      stroke(255, 0, 0);
      var radius = initialRadius +
        (traffic[currTimeIdx][stationNames[idx]]) / personPerRadiusPixel;
      ellipse(0, 0, radius, radius);

      // Label the stations //
      rotate(radians(75));
      fill(255, 0, 0);
      noStroke();
      textSize(20);
      textAlign(LEFT, CENTER);
      text(stationNames[idx], initialRadius, 0);
      // // 
      pop();
    }

    push();
    translate(width / 2, height);
    fill(255, 0, 0);
    textSize(20);
    noStroke();
    textAlign(CENTER, BOTTOM);
    var currTime = traffic[currTimeIdx].startTime;
    text(nf(currTime.getHours(), 2) + ":" + nf(currTime.getMinutes(), 2), 0, 0);
    pop();

    currTimeIdx++;
    if (currTimeIdx >= traffic.length) {
      currTimeIdx = 0;
      looping = false;
      noLoop();
    }

    push();
    noStroke();
    fill(255, 0, 0);
    translate(width / 2, height);
    if (looping) {
      // Draw pause symbol //
      rect(-8, -45, 5, 20);
      rect(3, -45, 5, 20);
      // //
    } else {
      // Draw play symbol //
      beginShape();
      vertex(-8, -45);
      vertex(-8, -25);
      vertex(10, -35);
      endShape(CLOSE);
      // //
    }
    pop();
  }
}

// Start and Stop Animation //
var looping = true;

function mouseClicked() {
  looping ? noLoop() : loop();
  looping = !looping;
}
// //