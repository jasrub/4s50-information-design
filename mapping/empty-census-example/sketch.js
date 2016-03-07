var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0" //add your api key here
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
    "year": "2014"
} // add your request here

var colorMap = {
  "education_associates": 150,
  "education_bachelors": 100,
  "education_doctorate": 50,
  "education_ged": 200,
  "education_high_school": 175,
  "education_masters" : 75,
  "education_none" : 225,
  "education_professional" : 25
  
}

var responseData = {};
function callback(response) {
  //print(response);
  
  var dataObject = response.data[0];
  var total = 0;
  for (key in dataObject) {
    responseData[key] = Number (dataObject[key]);
    total+=responseData[key]
  }
  responseData.total = total;
  print(responseData);
}

function setup() {
  var sdk = new CitySDK();
  var census = sdk.modules.census;
  census.enable(apiKey);
  census.APIRequest(request, callback);
  
  createCanvas(400, 400);
}

function draw() {
  background(0);
  var r = min(width/2, height/2);
  
  push();
  translate(width/2, height/2);
  
  var angle = 0;
  for (key in responseData) {
    if (key != "total") {
      rotate(angle);
      angle = map(responseData[key], 0, responseData.total, 0, TWO_PI)
      fill(colorMap[key])
      arc(0,0,r,r, 0, angle)
    }
    
  }
  
  pop();
}