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
        "employment_male_transportation_occupations"
    ],
    "api": "acs5",
    "year": "2014"
} // add your request here

var c1 = "#3399ff" //blue
var c2 = "#ff99ff"  //pink
var c3 = "#ff9933" //orange
var c4 = "#33cc33" //green
var c5 = "#9900ff" //puerple
var c6 = "#3399ff"

var colorMap = {
        "employment_female_architecture_and_engineering_occupations":c1,
        "employment_female_arts_design_entertainment_sports_and_media_occupations":c2,
        "employment_female_building_and_grounds_cleaning_and_maintenance_occupations":c3,
        "employment_female_business_and_financial_operations_occupations":c4,
        "employment_female_community_and_social_service_occupations":c5,
        "employment_female_computer_and_mathematical_occupations":c1,
        "employment_female_computer_engineering_and_science_occupations":c1,
        "employment_female_construction_and_extraction_occupations":c3,
        "employment_female_education_legal_community_service_arts_and_media_occupations":c5,
        "employment_female_education_training_and_library_occupations":c5,
        "employment_female_farming_fishing_and_forestry_occupations":"white",
        "employment_female_fire_fighting_and_prevention_and_other_protective_service_workers_including_supervisors":c3,
        "employment_female_food_preparation_and_serving_related_occupations":c3,
        "employment_female_health_diagnosing_and_treating_practitioners_and_other_technical_occupations":c1,
        "employment_female_health_technologists_and_technicians":c1,
        "employment_female_healthcare_practitioners_and_technical_occupations":c1,
        "employment_female_healthcare_support_occupations":c5,
        "employment_female_installation_maintenance_and_repair_occupations":c3,
        "employment_female_law_enforcement_workers_including_supervisors":c4,
        "employment_female_legal_occupations":c4,
        "employment_female_life_physical_and_social_science_occupations":c1,
        "employment_female_management_business_and_financial_occupations":c4,
        "employment_female_management_business_science_and_arts_occupations":c4,
        "employment_female_management_occupations":c4,
        "employment_female_material_moving_occupations":c3,
        "employment_female_natural_resources_construction_and_maintenance_occupations":c3,
        "employment_female_office_and_administrative_support_occupations":c5,
        "employment_female_personal_care_and_service_occupations":c5,
        "employment_female_production_occupations":c3,
        "employment_female_production_transportation_and_material_moving_occupations":c3,
        "employment_female_protective_service_occupations":c5,
        "employment_female_sales_and_office_occupations":c4,
        "employment_female_sales_and_related_occupations":c4,
        "employment_female_service_occupations":c5,
        "employment_female_transportation_occupations":c3,
        "employment_male_architecture_and_engineering_occupations":c1,
        "employment_male_arts_design_entertainment_sports_and_media_occupations":c2,
        "employment_male_building_and_grounds_cleaning_and_maintenance_occupations":c3,
        "employment_male_business_and_financial_operations_occupations":c4,
        "employment_male_community_and_social_service_occupations":c5,
        "employment_male_computer_and_mathematical_occupations":c1,
        "employment_male_computer_engineering_and_science_occupations":c1,
        "employment_male_construction_and_extraction_occupations":c3,
        "employment_male_education_legal_community_service_arts_and_media_occupations":c5,
        "employment_male_education_training_and_library_occupations":c5,
        "employment_male_farming_fishing_and_forestry_occupations":"white",
        "employment_male_fire_fighting_and_prevention_and_other_protective_service_workers_including_supervisors":c3,
        "employment_male_food_preparation_and_serving_related_occupations":c3,
        "employment_male_health_diagnosing_and_treating_practitioners_and_other_technical_occupations":c1,
        "employment_male_health_technologists_and_technicians":c1,
        "employment_male_healthcare_practitioners_and_technical_occupations":c1,
        "employment_male_healthcare_support_occupations":c5,
        "employment_male_installation_maintenance_and_repair_occupations":c3,
        "employment_male_law_enforcement_workers_including_supervisors":c4,
        "employment_male_legal_occupations":c4,
        "employment_male_life_physical_and_social_science_occupations":c1,
        "employment_male_management_business_and_financial_occupations":c4,
        "employment_male_management_business_science_and_arts_occupations":c4,
        "employment_male_management_occupations":c4,
        "employment_male_material_moving_occupations":c3,
        "employment_male_natural_resources_construction_and_maintenance_occupations":c3,
        "employment_male_office_and_administrative_support_occupations":c5,
        "employment_male_personal_care_and_service_occupations":c5,
        "employment_male_production_occupations":c3,
        "employment_male_production_transportation_and_material_moving_occupations":c3,
        "employment_male_protective_service_occupations":c5,
        "employment_male_sales_and_office_occupations":c4,
        "employment_male_sales_and_related_occupations":c4,
        "employment_male_service_occupations":c5,
        "employment_male_transportation_occupations":c3
}

var responseData = {};

function preload() {
  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key
  responseData.female={}
  responseData.male={}
  census.APIRequest(request_female, function(response) {
    var dataObject = response.data;
    for (var i=0; i<dataObject.length; i++) {
    state = dataObject[i]["name"]
    responseData.female[state] = {};
    var total = 0;
    for (key in dataObject[i]) {
      if (key!="name" && key!="state") {
        responseData.female[state][key] = Number (dataObject[i][key]);
        total+=responseData.female[state][key]
      }
    }
    responseData.female[state].total = total;
  }
  })
  census.APIRequest(request_male, function(response) {
    var dataObject = response.data;
    for (var i=0; i<dataObject.length; i++) {
    state = dataObject[i]["name"]
    responseData.male[state] = {};
    var total = 0;
    for (key in dataObject[i]) {
      if (key!="name" && key!="state") {
        responseData.male[state][key] = Number (dataObject[i][key]);
        total+=responseData.male[state][key]
      }
    }
    responseData.male[state].total = total;
  }
  print(responseData);
  })
  
}

function setup() {

  createCanvas(1000, 1000);
}

function draw() {
  background(0);
  push();
  translate(0,15)
  var pieWidth = width/10;
  var pieHeight = height/6
  var r = min(pieWidth, pieHeight/2) -10
  var w =0
  var h = 0;
  for (state in responseData.female) {
    push();
    translate(w*pieWidth+pieWidth/2, h*pieHeight+r/2);
    var angle = 0;
    var i=0;
    push();
    for (key in responseData.female[state]) {
      if (key != "total") {
        rotate(angle);
        angle = map(responseData.female[state][key], 0, responseData.female[state].total, 0, TWO_PI)
        //fill(0)
        //text(angle, 0,0)
        fillVal = map (i, 0, Object.keys(responseData.female[state]).length, 255, 0)
        fillVal = color(colorMap[key])
        noStroke();
        fill(fillVal)
        arc(0,0,r,r, 0, angle)
        i++
      }
    }
    pop();
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11)
    text (state, 0, -pieHeight/3+8)
    pop();
    w++
    if (w%10==0) {
      w=0;
      h++
    }
  }
  
  w =0
  h = 0;
  for (state in responseData.male) {
    push();
    translate(w*pieWidth+pieWidth/2, h*pieHeight+r*1.5);
    var angle = 0;
    var i=0;
    push();
    for (key in responseData.male[state]) {
      if (key != "total") {
        rotate(angle);
        angle = map(responseData.male[state][key], 0, responseData.male[state].total, 0, TWO_PI)
        //fill(0)
        //text(angle, 0,0)
        fillVal = map (i, 0, Object.keys(responseData.male[state]).length, 255, 0)
        fillVal = color(colorMap[key])
        noStroke();
        fill(fillVal)
        arc(0,0,r,r, 0, angle)
        i++
      }
    }
    pop();
    pop();
    w++
    if (w%10==0) {
      w=0;
      h++
    }
  }
  pop();
}