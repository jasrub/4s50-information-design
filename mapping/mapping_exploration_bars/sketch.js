var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0" //add your api key here
var request_female = {
    "level": "us",
    "lat": 46.8133,
    "lng": -100.779,
    "sublevel": true,
    "variables": [
        "employment_female_architecture_and_engineering_occupations",
        "employment_female_arts_design_entertainment_sports_and_media_occupations",
        "employment_female_building_and_grounds_cleaning_and_maintenance_occupations",
        "employment_female_business_and_financial_operations_occupations",
        "employment_female_community_and_social_service_occupations",
        "employment_female_computer_and_mathematical_occupations",
        "employment_female_computer_engineering_and_science_occupations",
        "employment_female_construction_and_extraction_occupations",
        "employment_female_education_legal_community_service_arts_and_media_occupations",
        "employment_female_education_training_and_library_occupations",
        "employment_female_farming_fishing_and_forestry_occupations",
        "employment_female_fire_fighting_and_prevention_and_other_protective_service_workers_including_supervisors",
        "employment_female_food_preparation_and_serving_related_occupations",
        "employment_female_health_diagnosing_and_treating_practitioners_and_other_technical_occupations",
        "employment_female_health_technologists_and_technicians",
        "employment_female_healthcare_practitioners_and_technical_occupations",
        "employment_female_healthcare_support_occupations",
        "employment_female_installation_maintenance_and_repair_occupations",
        "employment_female_law_enforcement_workers_including_supervisors",
        "employment_female_legal_occupations",
        "employment_female_life_physical_and_social_science_occupations",
        "employment_female_management_business_and_financial_occupations",
        "employment_female_management_business_science_and_arts_occupations",
        "employment_female_management_occupations",
        "employment_female_material_moving_occupations",
        "employment_female_natural_resources_construction_and_maintenance_occupations",
        "employment_female_office_and_administrative_support_occupations",
        "employment_female_personal_care_and_service_occupations",
        "employment_female_production_occupations",
        "employment_female_production_transportation_and_material_moving_occupations",
        "employment_female_protective_service_occupations",
        "employment_female_sales_and_office_occupations",
        "employment_female_sales_and_related_occupations",
        "employment_female_service_occupations",
        "employment_female_transportation_occupations",
        "employment_employed",
        "population",
    ],
    "api": "acs5",
    "year": "2014"
} // add your request here

var request_male = {
    "level": "us",
    "lat": 46.8133,
    "lng": -100.779,
    "sublevel": true,
    "variables": [
        "employment_male_architecture_and_engineering_occupations",
        "employment_male_arts_design_entertainment_sports_and_media_occupations",
        "employment_male_building_and_grounds_cleaning_and_maintenance_occupations",
        "employment_male_business_and_financial_operations_occupations",
        "employment_male_community_and_social_service_occupations",
        "employment_male_computer_and_mathematical_occupations",
        "employment_male_computer_engineering_and_science_occupations",
        "employment_male_construction_and_extraction_occupations",
        "employment_male_education_legal_community_service_arts_and_media_occupations",
        "employment_male_education_training_and_library_occupations",
        "employment_male_farming_fishing_and_forestry_occupations",
        "employment_male_fire_fighting_and_prevention_and_other_protective_service_workers_including_supervisors",
        "employment_male_food_preparation_and_serving_related_occupations",
        "employment_male_health_diagnosing_and_treating_practitioners_and_other_technical_occupations",
        "employment_male_health_technologists_and_technicians",
        "employment_male_healthcare_practitioners_and_technical_occupations",
        "employment_male_healthcare_support_occupations",
        "employment_male_installation_maintenance_and_repair_occupations",
        "employment_male_law_enforcement_workers_including_supervisors",
        "employment_male_legal_occupations",
        "employment_male_life_physical_and_social_science_occupations",
        "employment_male_management_business_and_financial_occupations",
        "employment_male_management_business_science_and_arts_occupations",
        "employment_male_management_occupations",
        "employment_male_material_moving_occupations",
        "employment_male_natural_resources_construction_and_maintenance_occupations",
        "employment_male_office_and_administrative_support_occupations",
        "employment_male_personal_care_and_service_occupations",
        "employment_male_production_occupations",
        "employment_male_production_transportation_and_material_moving_occupations",
        "employment_male_protective_service_occupations",
        "employment_male_sales_and_office_occupations",
        "employment_male_sales_and_related_occupations",
        "employment_male_service_occupations",
        "employment_male_transportation_occupations",
        "employment_employed",
        "population",
    ],
    "api": "acs5",
    "year": "2014"
} // add your request here

var maxRates = {
        "architecture_and_engineering_occupations":0,
        "arts_design_entertainment_sports_and_media_occupations":0,
        "building_and_grounds_cleaning_and_maintenance_occupations":0,
        "business_and_financial_operations_occupations":0,
        "community_and_social_service_occupations":0,
        "computer_and_mathematical_occupations":0,
        "computer_engineering_and_science_occupations":0,
        "construction_and_extraction_occupations":0,
        "education_legal_community_service_arts_and_media_occupations":0,
        "education_training_and_library_occupations":0,
        "farming_fishing_and_forestry_occupations":0,
        "fire_fighting_and_prevention_and_other_protective_service_workers_including_supervisors":0,
        "food_preparation_and_serving_related_occupations":0,
        "health_diagnosing_and_treating_practitioners_and_other_technical_occupations":0,
        "health_technologists_and_technicians":0,
        "healthcare_practitioners_and_technical_occupations":0,
        "healthcare_support_occupations":0,
        "installation_maintenance_and_repair_occupations":0,
        "law_enforcement_workers_including_supervisors":0,
        "legal_occupations":0,
        "life_physical_and_social_science_occupations":0,
        "management_business_and_financial_occupations":0,
        "management_business_science_and_arts_occupations":0,
        "management_occupations":0,
        "material_moving_occupations":0,
        "natural_resources_construction_and_maintenance_occupations":0,
        "office_and_administrative_support_occupations":0,
        "personal_care_and_service_occupations":0,
        "production_occupations":0,
        "production_transportation_and_material_moving_occupations":0,
        "protective_service_occupations":0,
        "sales_and_office_occupations":0,
        "sales_and_related_occupations":0,
        "service_occupations":0,
        "transportation_occupations":0,
}

var c1 = "#3399ff" //blue
var c2 = "#ff99ff"  //pink
var c3 = "#ff9933" //orange
var c4 = "#33cc33" //green
var c5 = "#9900ff" //puerple
var c6 = "#3399ff"

var responseData = {};
var rateKey = "employment_employed"// "population" // "employment_employed"
var maxRate = 0;
var re = "[a-zA-Z]*_[a-zA-Z]*_(.*)"

function preload() {
  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key
  responseData.female={}
  responseData.male={}
  census.APIRequest(request_female, function(response) {
    //print (response)
    var dataObject = response.data;
    for (var i=0; i<dataObject.length; i++) {
    state = dataObject[i]["name"]
    responseData.female[state] = {};
    responseData.female[state]["employment_employed"] = Number(dataObject[i]["employment_employed"])
    responseData.female[state]["population"] = Number(dataObject[i]["population"])
    for (key in dataObject[i]) {
      if (key!="name" && key!="state" && key!="employment_employed" && key!="population") {
        var num = Number (dataObject[i][key]);
        responseData.female[state][key] = num;
        var generalKey = key.match(re)[1];
        var rate = num / responseData.female[state][rateKey]
        if (rate>maxRates[generalKey]) {
          maxRates[generalKey] = rate
          if (rate>maxRate) {
            maxRate = rate
          }
        }
      }
    }
  }
  })
  
  census.APIRequest(request_male, function(response) {
    //print (response)
    var dataObject = response.data;
    for (var i=0; i<dataObject.length; i++) {
    state = dataObject[i]["name"]
    responseData.male[state]={}
    responseData.male[state]["employment_employed"] = Number(dataObject[i]["employment_employed"])
    responseData.male[state]["population"] = Number(dataObject[i]["population"])
    for (key in dataObject[i]) {
      if (key!="name" && key!="state" && key!="employment_employed" && key!="population") {
        var num = Number (dataObject[i][key]);
        responseData.male[state][key] = num;
        var generalKey = key.match(re)[1];
        var rate = num / responseData.male[state][rateKey]
        if (rate>maxRates[generalKey]) {
          maxRates[generalKey] = rate
          if (rate>maxRate) {
            maxRate = rate
          }
        }
      }
    }
  }
  print (maxRate)
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
  background(220);
  padding = 20;
  numKeys = Object.keys(maxRates).length;
  barHeight = ((height-padding-padding)/numKeys);
  x=0;
  for (state in responseData.female) {
    xPos = map(x, 0, 51, padding, width-padding);
    stateName(xPos, state[0]+state[1])
    x++
    h=0;
    for (key in maxRates) {
      push();
      fill(color("#ff80df"));
      rectMode(CORNERS);
      noStroke();
      y = map (responseData.female[state]["employment_female_"+key]/responseData.female[state][rateKey], 0, maxRate, barHeight-20, 0)
      rect(xPos-7,h*barHeight+padding+y+20 ,xPos, (h+1)*barHeight+padding)
      fill(color("#3399ff"));
      y = map (responseData.male[state]["employment_male_"+key]/responseData.male[state][rateKey], 0,maxRate, barHeight-20, 0)
      rect(xPos,h*barHeight+padding+y+20 ,xPos+7, (h+1)*barHeight+padding)
      pop();
      h++
    }
  }
  h=0;
  for (key in maxRates) {
      push();
      fill(0);
      noStroke();
      textSize(15);
      textFont ('Optima');
      text(key,padding,(h)*barHeight+padding+18)
      pop();
      h++
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}