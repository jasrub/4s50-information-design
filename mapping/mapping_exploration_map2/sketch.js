var apiKey = ""; // TODO: add api key

var request = {
  "level": "state",
  "variables": [
    "employment_male_computer_and_mathematical_occupations",
    "employment_female_computer_and_mathematical_occupations",
    "employment_employed",
  ],
  "api": "acs5",
  "year": "2013"
};

// Use this variable to keep track of which
// color you want to use to represent each variable
var colorMap = {
  "employment_male_computer_and_mathematical_occupations":150,
  "employment_female_computer_and_mathematical_occupations":200,
  "employment_employed":100,
};

// Use this variable
var selectedState;
var census;

var stateIds = [];

var employmentData = {};
var maxRate = 0 

function getStateData(stateName) {
  request.state = stateName;
  // Make a a census request for each state
  census.APIRequest(request, function(response) {
    if (response) {
      rawData = response.data[0];
      var employmentDataForState = {};
      var total = 0;
      for (var key in rawData) {
        employmentDataForState[key] = Number(rawData[key]);
        if (key != "employment_employed"){
          total += employmentDataForState[key];
        }
      }
      rate = total/ employmentDataForState[key]
      if (rate>maxRate) {
        maxRate = rate
      }
      employmentDataForState.total = total;
      employmentDataForState.rate = rate;
      employmentData[stateName] = employmentDataForState;
    }
  });
}

doneLoading = false
function colorToHexVal (r, g, b) {
  return("#"+hex(r, 2)+hex(g, 2)+hex(b, 2))
}

function setup() {
  // Enable the census module
  var sdk = new CitySDK();
  census = sdk.modules.census;
  census.enable(apiKey);
  
  print(employmentData)

  // Size the canvas
  var cnv = createCanvas(959, 593);
  cnv.position(0, 0);


  // Add the map to the screen
  $.get("./map.svg", function(data) {
    var mapElement = document.createElement("div");
    mapElement.innerHTML = data;
    document.body.appendChild(mapElement);
    $(mapElement).css('position', 'absolute');


  }, 'text')
  .done (function() {
    $( "path" ).each(function( index ) {
      if ($(this)){
        id =  $( this ).attr("id")
        if(index<51) {
          getStateData(id);
          
        }
        if (index>51){
          doneLoading = true
        }
      }
    });
    
  });
}


function draw() {
  background(0);
  if (doneLoading){
       $( "path" ).each(function( index ) {
      if ($(this)){
        id =  $( this ).attr("id")
        if(index<51) {
          opac = map(employmentData[id].rate,0, maxRate, 0.3,1);
          $(this).css('fill', 'rgba(255,0,0'+opac+')')
          
        }

      }
     });
}
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