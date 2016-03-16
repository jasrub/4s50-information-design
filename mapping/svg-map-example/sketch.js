var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0"; // TODO: add api key
var request = {
  "level": "state",
  "variables": [
    "education_associates",
    "education_bachelors",
    "education_doctorate",
    "education_ged",
    "education_high_school",
    "education_masters",
    "education_none",
    "education_professional"
  ],
  "api": "acs5",
  "year": "2013"
};

var printed = false;

// Use this variable to keep track of which
// color you want to use to represent each variable
var colorMap = {
  "education_associates": 100,
  "education_bachelors": 150,
  "education_doctorate": 200,
  "education_ged": 255,
  "education_high_school": 50,
  "education_masters": 25,
  "education_none": 175,
  "education_professional": 125
}

var educationData = {};

var stateIdDict = {};
var stateIds = [];

var numStatesLoaded = 0;

var currentState = null;

$(document).ready(function() {

  // Build map from DOM state id to census state id 
  // and build list of census state ids
  // and init object in education data for each state
  $('path').each(function() {
    var mapId = $(this).attr('id');
    var censusId = mapId.toUpperCase().substring(0, 2);
    stateIdDict[mapId] = censusId;
    if (stateIds.indexOf(censusId) === -1) {
      stateIds.push(censusId);
    }
    educationData[censusId] = {};
  });

  // When state clicked
  $('path').on('click', function() {

    currentState = stateIdDict[$(this).attr('id')];

    // Clear all state fills
    $('path').css('fill', "#E0E0E0");

    // Michigan special case; fill two shapes
    if (["MI1", "MI2"].indexOf($(this).attr('id')) > -1) {
      $('#MI1, #MI2').css('fill', "#A0A0A0");

      // Fill clicked state
    } else {
      $(this).css('fill', "#A0A0A0");
    }

  });

});

function getStateData(i) {
  request.state = stateIds[i];
  var state = stateIds[i];

  // Make a a census request for each state
  census.APIRequest(request, function(response) {
    rawData = response.data[0];
    var total = 0;
    for (key in rawData) {
      educationData[state][key] = Number(rawData[key]);
      total += educationData[state][key]
    }
    educationData[state].total = total;
    
    numStatesLoaded++;
  });
}

function preload() {
  var sdk = new CitySDK();
  census = sdk.modules.census;
  census.enable(apiKey);

  // Fills educatidon data with each state using recursive calls
  for (var i = 0; i < stateIds.length; i++) {
    getStateData(i);
  }
}

function setup() {
  createCanvas(1024, 768);
}

function draw() {
  background(0);

  if (currentState !== null) {

    // Draw pie chart
    var r = 100;
    push();
    translate(900, 600);
    var angle = 0;
    var data = educationData[currentState];
    for (key in data) {
      if (key !== "total") {
        rotate(angle);
        angle = map(data[key], 0, data.total, 0, TWO_PI);
        fill(colorMap[key]);
        arc(0, 0, r, r, 0, angle);
      }
    }
    pop();
  }

  // Display "loading" text
  if (numStatesLoaded < 51) {
    fill(255);
    text((numStatesLoaded*2) + "% data retrieved", 0, 10);
  }
}