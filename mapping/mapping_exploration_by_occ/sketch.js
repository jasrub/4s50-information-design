var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0" //add your api key here
var request = {
    "level": "us",
    "state":"",
    "sublevel": false,
    "variables": [
        "employment_employed",
        "population",
    ],
    "api": "acs5",
    "year": "2014"
} // add your request here


// var maxRates = {
//         "management_occupations":0,
//         "business_and_financial_operations_occupations":0,
//         "computer_and_mathematical_occupations":0,
//         "architecture_and_engineering_occupations":0,
//         "life_physical_and_social_science_occupations":0,
//         "community_and_social_service_occupations":0,
//         "legal_occupations":0,
//         "education_training_and_library_occupations":0,
//         "arts_design_entertainment_sports_and_media_occupations":0,
//         "healthcare_practitioners_and_technical_occupations":0,
//         "healthcare_support_occupations":0,
//         "protective_service_occupations":0,
//         "food_preparation_and_serving_related_occupations":0,
//         "building_and_grounds_cleaning_and_maintenance_occupations":0,
//         "personal_care_and_service_occupations":0,
//         "sales_and_related_occupations":0,
//         "office_and_administrative_support_occupations":0,
//         "farming_fishing_and_forestry_occupations":0,
//         "construction_and_extraction_occupations":0,
//         "installation_maintenance_and_repair_occupations":0,
//         "production_occupations":0,
//         "material_moving_occupations":0,
//         "transportation_occupations":0,
// }
var maxRates = {
        "management_occupations":"",
        "business_and_financial_operations_occupations":"",
        "computer_and_mathematical_occupations":"",
        "architecture_and_engineering_occupations":"",
        "life_physical_and_social_science_occupations":"",
        "community_and_social_service_occupations":"",
        "legal_occupations":"",
        "education_training_and_library_occupations":"",
        "arts_design_entertainment_sports_and_media_occupations":"",
        "healthcare_practitioners_and_technical_occupations":"",
        "healthcare_support_occupations":"",
        "protective_service_occupations":"",
        "food_preparation_and_serving_related_occupations":"",
        "building_and_grounds_cleaning_and_maintenance_occupations":"",
        "personal_care_and_service_occupations":"",
        "sales_and_related_occupations":"",
        "office_and_administrative_support_occupations":"",
        "farming_fishing_and_forestry_occupations":"",
        "construction_and_extraction_occupations":"",
        "installation_maintenance_and_repair_occupations":"",
        "production_occupations":"",
        //"material_moving_occupations":"",
        "transportation_occupations":"",
}


var responseData = {};
var rateKey = "employment_employed"// "population"
var maxRate = 0;
var re = "[a-zA-Z]*_[a-zA-Z]*_(.*)"
var loaded=false

var fe = "employment_female_"
var ma = "employment_male_"

function preload() {
  iconsFont = loadFont('fontello.ttf');
  
  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key
  responseData.female={}
  responseData.male={}
  for (key in maxRates) {
    request.variables.push(fe+key)
    request.variables.push(ma+key)
  }
  census.APIRequest(request, function(response) {
    //print (response)
    var dataObject = response.data[0];
    responseData["employment_employed"] = Number(dataObject["employment_employed"])
    responseData["population"] = Number(dataObject["population"])
    responseData.female.total = 0
    responseData.male.total = 0
    for (key in maxRates) {
        var fKey = fe+key;
        fnum = Number (dataObject[fKey]);
        responseData.female[fKey] = fnum;
        responseData.female.total+=fnum;
        
        var mKey = ma+key;
        mnum = Number (dataObject[mKey]);
        responseData.male[mKey] = mnum;
        responseData.male.total += mnum;
        
        responseData[key]  = mnum + fnum
    }
    responseData.totalEmployed = responseData.female.total + responseData.male.total
    loaded=true;
    print (responseData)
  })
}

function setup() {

  createCanvas(windowWidth, windowHeight);
}

function stateName (xPos, name) {
  push();
  noStroke();
  fill(255);
  textSize(10)
  textFont('Optima');
  textAlign(CENTER, CENTER)
  text (name, xPos, padding)
  pop();
}

function draw() {
  background(255)
  push();
  
  var padding = 20
  fill(0)
  noStroke()
  
  push();
  textAlign(CENTER, CENTER)
  textFont('optima')
  textSize(30)
  text ("Occupations in the U.S", width/2, padding)
  pop();
  
  translate (0, padding+30)
  if (loaded) {
    var values = Object.keys(responseData).map(function(key){
      if (key!="population" && key!="employment_employed" && key!="female" && key!="male"){
        return responseData[key];
      }
      else {
        return 0;
      }
    });
    var maxNum = max(values)
    var numCols = Math.floor((width-padding*2)/320)
    var colWidth = (width-padding*2)/numCols
    var rowHeight = (height-padding*2)/(Math.ceil(Object.keys(maxRates).length/numCols))
    var iconSize = min(colWidth, rowHeight)/2.5
    textAlign(CENTER, CENTER)
    var w=0;
    var h=0;
    for (key in maxRates) {
      push();
      translate(w*colWidth+colWidth/2, h*rowHeight)
      value = responseData[key]/responseData.employment_employed
      //var iconSize = map(value, 0, maxNum/responseData.employment_employed, 20, 100)
      fill(0);
      noStroke();
      textFont (iconsFont);
      textSize(iconSize);
      text(maxRates[key], 0, iconSize/2);
      
      push();
      translate (0, iconSize+10);
      textFont('Optima');
      textSize(15);
      text(key.replace(/_|occupations/g, ' '), 0,0)
      
      push();
      translate (0, 20);
      totalRestSize  = colWidth-40
      var rectStart = -totalRestSize/2
      var rectHeight = 20
      fill(240);
      rect(rectStart, 0, totalRestSize, rectHeight)
      fill (color("#76d5c4"))
      var SizeOfOccupation =  map(responseData[key]/responseData.totalEmployed,0,1,0, totalRestSize)
      rect(rectStart, 0,SizeOfOccupation, rectHeight)
      fill(0)
      noStroke()
      textFont('Optima')
      textSize(7)
      //text(round(responseData[key]/responseData["employment_employed"]*100)+"% of employed population", 0, 8)
      
      
      fill(color("#ff9ecb"));
      var x = map (responseData.female[fe+key]/responseData[key], 0, 1, 0, 300)

      rect (rectStart, rectHeight+3, x, rectHeight);
      fill(color("#7acfeb"));
      rect (rectStart+x, rectHeight+3,totalRestSize-x, rectHeight)
      pop();
      
      pop();
      w++
      if (w%numCols==0) {
        w=0;
        h++;
      }
      pop();
    }
    // male vs female pie chart
    push();
    translate(w*colWidth+colWidth/2, h*rowHeight+rowHeight/2)
    r = min (colWidth/2, rowHeight/2)

    angle = map(responseData.female.total, 0,responseData.totalEmployed, 0, TWO_PI);
    fill(color("#ff9ecb"));
    arc(0, 0, r, r, 0, angle);
    
    rotate (angle)
    angle = map(responseData.male.total, 0,responseData.totalEmployed, 0, TWO_PI);
    fill(color("#7acfeb"));
    arc(0, 0, r, r, 0, angle);
    
    pop();
    
  }
pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}