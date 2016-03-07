var apiKey = ""; // TODO: add your api key here
var request = {
  "level": "state",
  "state": "MA",
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
}

// Use this variable to keep track of which
// color you want to use to represent each variable
var colorMap = {
    "education_associates" : 100,
    "education_bachelors" : 150,
    "education_doctorate" : 200,
    "education_ged" : 255,
    "education_high_school" : 50,
    "education_masters" : 25,
    "education_none" : 175,
    "education_professional" : 125
}

var educationData = {};

function preload() {
  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key

  census.APIRequest(request, function(response) {
    print(response);
    rawData = response.data[0];
    var total = 0;
    for (key in rawData) {
      educationData[key] = Number(rawData[key]);
      total+=educationData[key]
    }
    educationData.total = total;
  })
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  var r = min(width/2, height/2);

  push();
  translate(width/2, height/2);
  
  var angle = 0;
  for (key in educationData) {
    if (key != "total") {
      rotate(angle);
      angle = map(educationData[key], 0, educationData.total, 0, TWO_PI);
      fill(colorMap[key]);
      arc(0, 0, r, r, 0, angle);
    }
  }
  pop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}