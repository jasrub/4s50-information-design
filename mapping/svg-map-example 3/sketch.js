var apiKey = ""; // TODO: add api key

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
};

// Use this variable
var selectedState;
var census;

var educationData = {};

function getStateData(stateName) {
  request.state = stateName;

  // Make a a census request for each state
  census.APIRequest(request, function(response) {
    rawData = response.data[0];
    var educationDataForState = {};
    var total = 0;
    for (var key in rawData) {
      educationDataForState[key] = Number(rawData[key]);
      total += educationDataForState[key];
    }
    educationDataForState.total = total;
    educationData[stateName] = educationDataForState;

  });
}

function setup() {
  // Enable the census module
  var sdk = new CitySDK();
  census = sdk.modules.census;
  census.enable(apiKey);

  // Size the canvas
  var cnv = createCanvas(959, 593);
  cnv.position(0, 0);


  // Add the map to the screen
  $.get("./map.svg", function(data) {
    var mapElement = document.createElement("div");
    mapElement.innerHTML = data;
    document.body.appendChild(mapElement);
    $(mapElement).css('position', 'absolute');

    // Selected states should be a different color.
    var svgStyle = mapElement.getElementsByTagName("style")[0];
    svgStyle.innerHTML += ".selected { fill: #A0A0A0 }";

    // Callback for clicking on states
    $('path').on('click', function() {
      selectedState = $(this).attr('id');
      if (!educationData[selectedState]) {
        getStateData(selectedState);
      }
      $('path').removeClass('selected');
      $(this).addClass('selected');
    });
  }, 'text');

}

function draw() {
  background(0);
  if (selectedState) {

    // Draw pie chart or "loading" text
    var r = 100;
    push();
    translate(875, 450);
    var angle = 0;
    var data = educationData[selectedState];
    if (!data) {
      fill(255);
      text("Loading data for " + selectedState + "...", -r / 2, -r / 2, r, r);
    }
    for (var key in data) {
      if (key !== "total") {
        rotate(angle);
        angle = map(data[key], 0, data.total, 0, TWO_PI);
        fill(colorMap[key]);
        arc(0, 0, r, r, 0, angle);
      }
    }
    pop();
  }

}