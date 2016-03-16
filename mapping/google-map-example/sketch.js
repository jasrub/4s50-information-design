var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0"; // TODO: add api key
var request = {
  "level": "county",
  "state": "MA",
  "container": "state",
  "sublevel": "true",
  "variables": [
    "education_bachelors",
    "education_doctorate",
    "education_ged",
    "education_high_school",
    "education_masters",
    "education_none",
    "education_professional"
  ],
  "api": "acs5",
  "year": "2014"
}

// Use this variable to keep track of which
// color you want to use to represent each variable
var colorMap = {
  "education_associates": 175,
  "education_bachelors": 125,
  "education_doctorate": 50,
  "education_ged": 225,
  "education_high_school": 200,
  "education_masters": 100,
  "education_none": 250,
  "education_professional": 150
}

var educationData = {}; // An object holding education data for
// each county in the state
var currentCounty = ""; // The name of the county whose
// pie chart is currently being displayed


function mapSetup(response) {
  // Center the map over the first county in the list
  var centlat = Number(response.features[0].properties.CENTLAT);
  var centlon = Number(response.features[0].properties.CENTLON);
  var mapOptions = {
    center: {
      lat: centlat,
      lng: centlon
    },
    zoom: 6
  };
  var googleMap =
    new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


  // Set the color of the outlines and shapes...
  googleMap.data.setStyle({
    fillColor: "gray",
    strokeColor: "black",
    strokeWeight: 1
  });
  // ...and then add them to map
  googleMap.data.addGeoJson(response);

  // Make the shapes clickable, add a callback function
  googleMap.data.addListener('click', function(event) {
    currentCounty = event.feature.getProperty("NAME");
  });
}

function dataSetup(response) {
  var features = response.features;
  for (fidx in features) {
    var dataForFeature = {};
    var total = 0;
    for (key in response.totals) {
      dataForFeature[key] = Number(features[fidx].properties[key]);
      total += dataForFeature[key];
    }
    dataForFeature.total = total;
    educationData[features[fidx].properties.NAME] = dataForFeature;
  }
}

function callback(response) {
  mapSetup(response);
  dataSetup(response);
}

function preload() {
  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key

  census.GEORequest(request, callback);
}

function setup() {
  // Make an HTML element to hold the Google map
  mapCanvas = createDiv("");
  mapCanvas.id("map-canvas")
    .style("width", "400px")
    .style("height", "200px")
    .position(0, 0);

  // Make the p5.js canvas
  canvas = createCanvas(400, 200);
  canvas.position(0, 200);

  noStroke();
}


function draw() {
  background(0);
  if (currentCounty) { // see googleMap.data.addlistener
                       // in mapSetup
    var r = min(width / 2, height / 2);

    push();
    translate(width / 2, height / 2);

    var angle = 0;
    countyEducationData = educationData[currentCounty];
    for (key in countyEducationData) {
      if (key != "total") {
        rotate(angle);
        var cedk = countyEducationData[key];
        var cedt = countyEducationData.total;
        angle = map(cedk, 0, cedt, 0, TWO_PI);
        fill(colorMap[key]);
        arc(0, 0, r, r, 0, angle);
      }
    }
    pop();
  }
}