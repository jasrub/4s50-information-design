var apiKey = "cd571161f4c54da7130e94176250627ce996ccd0" //add your api key here
var request = {
    "level": "us",
    "state": "",
    "sublevel": false,
    "variables": [
      "employment_employed",
      "population",
    ],
    "api": "acs5",
    "year": "2014"
  } // add your request here
  
var state_request = {
    "level": "state",
    "state": "",
    "sublevel": false,
    "variables": [
      "employment_employed",
      "population",
    ],
    "api": "acs5",
    "year": "2014"
  } // add your request here

var maxRates = {
  "management_occupations": "",
  "business_and_financial_operations_occupations": "",
  "computer_and_mathematical_occupations": "",
  "architecture_and_engineering_occupations": "",
  "life_physical_and_social_science_occupations": "",
  "community_and_social_service_occupations": "",
  "legal_occupations": "",
  "education_training_and_library_occupations": "",
  "arts_design_entertainment_sports_and_media_occupations": "",
  "healthcare_practitioners_and_technical_occupations": "",
  "healthcare_support_occupations": "",
  "protective_service_occupations": "",
  "food_preparation_and_serving_related_occupations": "",
  "building_and_grounds_cleaning_and_maintenance_occupations": "",
  "personal_care_and_service_occupations": "",
  "sales_and_related_occupations": "",
  "office_and_administrative_support_occupations": "",
  "farming_fishing_and_forestry_occupations": "",
  "construction_and_extraction_occupations": "",
  "installation_maintenance_and_repair_occupations": "",
  "production_occupations": "",
  "material_moving_occupations": "",
  "transportation_occupations": "",
}

var mouseArcs = {}


var responseData = {};
var allStatesData = {};
var rateKey = "employment_employed" // "population"
var maxRate = 0;
var re = "[a-zA-Z]*_[a-zA-Z]*_(.*)"
var loaded = false

var fe = "employment_female_"
var ma = "employment_male_"

var selectedOccupation = ""
var isSelected = false
var selectedColor;
hues = []
var numKeys

var titlesPadding
var titlesLineHeight

var donutWidth;

var showTitles = false
var showButton = "+"

var loadedStates = 0

var textColor = 80

function getStateData(stateName) {
  state_request.state = stateName;
  // Make a a census request for each state
  census.APIRequest(state_request, function(response) {
    if (response) {
      rawData = response.data[0];
      var employmentDataForState = {};
      employmentDataForState["employment_employed"] = Number(rawData["employment_employed"])
      for (var key in maxRates) {
        var num = Number(rawData[fe+key])+Number(rawData[ma+key]);
        var rate = num/ employmentDataForState["employment_employed"]
        employmentDataForState[key] = rate
        if (rate>allStatesData["maxRate"][key]) {
          allStatesData["maxRate"][key] = rate
          if (rate>maxRate) {
            maxRate = rate
          }
        }
        if (rate<allStatesData["minRate"][key]) {
          allStatesData["minRate"][key] = rate
        }
      }
      allStatesData[stateName] = employmentDataForState;
      loadedStates++
    }
  });
}



function preload() {
  iconsFont = loadFont('fontello.ttf');
  numKeys = Object.keys(maxRates).length
  generateHues(numKeys, 262);
  

  var sdk = new CitySDK(); //Create the CitySDK Instance
  census = sdk.modules.census; //Create an instance of the module
  census.enable(apiKey); //Enable the module with the api key
  responseData.female = {}
  responseData.male = {}
  for (key in maxRates) {
    request.variables.push(fe + key)
    request.variables.push(ma + key)
  }
  census.APIRequest(request, function(response) {
    //print (response)
    var dataObject = response.data[0];
    responseData["employment_employed"] = Number(dataObject["employment_employed"])
    responseData["population"] = Number(dataObject["population"])
    responseData.female.total = 0
    responseData.male.total = 0
    for (key in maxRates) {
      var fKey = fe + key;
      fnum = Number(dataObject[fKey]);
      responseData.female[fKey] = fnum;
      responseData.female.total += fnum;

      var mKey = ma + key;
      mnum = Number(dataObject[mKey]);
      responseData.male[mKey] = mnum;
      responseData.male.total += mnum;

      responseData[key] = mnum + fnum
    }
    responseData.totalEmployed = responseData.female.total + responseData.male.total
    loaded = true;
    //print(responseData)
  })
}

function generateHues(numColors, start) {
  currentHue = start
  hues.push(currentHue)
  step = 360 / numColors
  for (var i = 1; i < numColors; i++) {
    currentHue += step;
    if (currentHue > 360) {
      currentHue -= 360;
    }
    hues.push(currentHue)
  }
  var i
  var j
  var holder = 0
  for (i = 0, j = floor(numColors / 2); i < floor(numColors / 2); i += 2, j += 2) {
    holder = hues[i];
    hues[i] = hues[j];
    hues[j] = holder;
  }
  // shuffle(hues,true)
}

var mapElement
var mapWidth
var mapHeight
var svg
var bgColor

function setup() {
  bgColor = color("#fffffd")
  
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  allStatesData["maxRate"] = {}
  allStatesData["minRate"] = {}
  
  donutWidth = max(min(height, width)/13, 5)
  
  for (key in maxRates) {
    allStatesData["maxRate"][key] = 0 
    allStatesData["minRate"][key] = 1 
    state_request.variables.push (fe+key)
    state_request.variables.push (ma+key)
  }

  // Add the map to the screen
  $.get("./map.svg", function(data) {
    mapElement = document.createElement("div");
    mapElement.innerHTML = data;
    document.body.appendChild(mapElement);
    $(mapElement).css('position', 'absolute');
    $(mapElement).css('z-index', '1000');
    $(mapElement).css('display', 'none');

  }, 'text')
  .done(function() {
    mapWidth  = $(mapElement).width();
    mapHeight = $(mapElement).height();
    svg = mapElement.getElementsByTagName("svg")[0];
    $( "path" ).each(function( index ) {
      if ($(this)){
        id =  $( this ).attr("id")
        if(index<51) {
          getStateData(id);
          
        }
      }
    });
  });
}

function clickedButton() {
  showTitles = !showTitles
  if (showTitles) {
    showButton = "-"
  }
  else {
    showButton = "+"
  }
}

function draw() {
  background(bgColor)
  
  push();
  fill(textColor)
  noStroke();
  textAlign (CENTER, CENTER);
  textSize(30)
  textStyle(BOLD)
  text(showButton, 15, 15)
  pop();
  if (loaded) {
    drawViz()
  }
  loadedText()
}

function loadedText() {
  push();
  fill(textColor)
  if (loadedStates<51) {
    text("loaded: "+round(map(loadedStates, 0,50, 0, 100))+"%", width/2, height-20)
  }
  pop();
}

var r
function drawViz() {
  r = min(width - 80, height - 80);
  noStroke()
  push();
  translate(width/2, height / 2);
  
  var angle = 0;
  colorMode(HSL);
  currHue = 10;
  s = 60;
  l = 60;
  currColor = color(currHue, s, l)
  step = 360 / numKeys
  var i = 0
  var angleTotal = 0

  titlesPadding = width/48
  titlesLineHeight = (height-titlesPadding*2)/numKeys
  push();
  rotate(-HALF_PI)
  for (key in maxRates) {
    rotate(angle);
    angleTotal += angle
    angle = map(responseData[key], 0, responseData["employment_employed"], 0, TWO_PI);
    if ((isSelected && key == selectedOccupation) || !isSelected) {
      selectedColor = color(hues[i], s, l)
      fill(selectedColor);
    } else {
      //fill(0, 0, 70)
      fill(color(hues[i], s-50, l+20))
    }
    arc(0, 0, r, r, 0, angle, PIE);
    if (!mouseArcs[key]) {
      startAngle = angleTotal
      endAngle = angleTotal+angle
      mouseArcs[key] = {startAng : startAngle, endAng : endAngle}
    }
    if (showTitles) {
      occupationText(key, titlesPadding, (i * titlesLineHeight)+ titlesLineHeight/2+ titlesPadding, -angleTotal+HALF_PI, titlesLineHeight/2)
    }
    
    //changeColor
    currHue += step
    if (currHue > 360) {
      currHue -= 360
    }
    currColor = color(currHue, s, l)
    i++
  }
  fill(bgColor)
  ellipse(0, 0, r - donutWidth, r - donutWidth)
  pop();
  
  if (!isSelected){ 
    push()
    colorMode(RGB)
    fill(textColor)
    noStroke()
    textFont('Optima')
    textSize(round((width*2/3)/15))
    textAlign(CENTER, CENTER)
    text("Jobs In America",0,0)
    pop()
  }
  pop();
  
  if (isSelected){
    drawSelected()
  }

}

function occupationText(key, x, y, rotateAngle, size) {
    push();
    string = key.replace(/_|occupations/g, ' ')
    rotate(rotateAngle);
    translate(-width/2, -height / 2)
    noStroke()
    push();
    textFont(iconsFont)
    textSize(size*1.8)
    icon = maxRates[key]
    iconWidth = textWidth(icon)
    text(icon, x, y)
    pop();
    push();
    textFont('Optima')
    textSize(size)
    text(string, iconWidth + 10 + x, y)
    pop();
    pop();
}

function selectedOccupationTitle(r) {
  size = round(r/30.5)
  x=0
  y=0
  
  iconSize = round(size*2)
  employmentTextHeigth = iconSize+size+3
  push();
    fill(30)
    translate(0, -r/2+donutWidth)
    string = selectedOccupation.replace(/_|occupations/g, ' ')
    noStroke()
    push();
    textFont(iconsFont)
    textSize(iconSize)
    icon = maxRates[selectedOccupation]
    iconWidth = textWidth(icon)
    fill(selectedColor)
    text(icon, x, y)
    pop();
    push();
    textFont('Optima')
    textSize(size)
    text(string, x, y+iconSize)
    textSize (size/1.5)
    text (round(responseData[selectedOccupation]/responseData["employment_employed"]*100)+"% of employed population", x, y+employmentTextHeigth)
    pop();
  pop();
  return (-r/2+donutWidth+employmentTextHeigth+size/1.5)
}

function drawMaleFemaleBar(textEndHeight, r) {
  push();
  translate (0, textEndHeight)
  colorMode(RGB)
  femaleColor = color("#ff9ecb")
  maleColor = color("#7acfeb")
  noStroke()
  fill(femaleColor)
  var rectHeight = donutWidth/4
  var rectWidth = r/3
  var rectStart = -rectWidth/2
  var x = map (responseData.female[fe+selectedOccupation]/responseData[selectedOccupation], 0, 1, 0, rectWidth)

  rect (rectStart, rectHeight+3, x, rectHeight);
  fill(maleColor);
  rect (rectStart+x, rectHeight+3,rectWidth-x, rectHeight)
  pop()

}

function setMapStyle(r) {
  mapNewWidth = r*4/5

  svg.setAttribute('viewBox', '0 0 ' +  mapWidth+ ' ' + mapHeight);
  svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
  svg.setAttribute('width' , r*4/5)
  svg.setAttribute('height' , mapHeight/(mapWidth/(r*4/5)))
  
  $(mapElement).css('display', 'block');
  $(mapElement).css('top', (height *2/5)+"px");
  $(mapElement).css('left', ((width /2)-mapNewWidth/2.3+"px"));
  
}

function drawSelected() {
  var insideR = min(width - 80, height - 80) - donutWidth;
  push();
  textAlign(CENTER, CENTER)
  translate(width/2, height / 2);
  
  textEndHeight = selectedOccupationTitle(insideR)
  drawMaleFemaleBar(textEndHeight, insideR)
  setMapStyle(insideR)
  
  pop();
}

function changeMapColors() {
    if (loadedStates==51) {
    //print (allStatesData)
    $( "path" ).each(function( index ) {
      if ($(this)){
        id =  $( this ).attr("id")
        if(index<51) {
          var colorVal  = round(map(allStatesData[id][selectedOccupation], allStatesData["minRate"][selectedOccupation], allStatesData["maxRate"][selectedOccupation], 230, 30))
          var colorString = "#"+(hex(colorVal, 2))+(hex(colorVal, 2))+(hex(colorVal, 2))
          $(this).attr('fill')
          $(this).attr('style', "fill: "+colorString)
        }
      }
    });
  }
}

function mouseClicked(x, y) {
  clickY = mouseY
  clickX = mouseX
  if (clickX>0 && clickX<30 && clickY>0 && clickY<30) {
    clickedButton()
    return
  }
  selectedOccupation = isOnArc(clickX, clickY)
  if (selectedOccupation!=""){
    isSelected = true
    changeMapColors()
    i=0
    for (key in maxRates){
      if (key==selectedOccupation){
        selectedI = i
        break;
      }
      i++
    }
    return
  }
  else if (showTitles){
    step = titlesLineHeight
    currHeight = titlesPadding+step
    i=0
    selectedI = -1
    gotI = false
    if (clickX < width/3) {
    for (key in maxRates) {
      if (clickY<currHeight) {
        selectedI = i
        selectedOccupation = key
        gotI = true
        break;
      }
      currHeight+=step
      i++
    }
    }
    if (gotI) {
     isSelected = true
    changeMapColors()
    return
    }
  }
  isSelected = false
  $(mapElement).css('display', 'none');

}

function keyReleased() {
  if (isSelected){
    if (keyCode === RIGHT_ARROW) {
      selectedI ++
      if (selectedI>=numKeys){
        selectedI = 0
      }
    } 
    if (keyCode === LEFT_ARROW) {
      selectedI --
      if (selectedI<0){
        selectedI = numKeys-1
      }
    } 
    i =0
    for (key in maxRates) {
      if (i==selectedI ){
        selectedOccupation = key
        break;
      }
      i++
    }
    changeMapColors()
  }
  return false; // prevent any default behavior
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function isOnArc(x,y) {
  var selected=""
  push();
  translate(width/2, height/2);
  clickAngle = atan2(mouseY-height/2, mouseX-width/2)+HALF_PI;
  if (clickAngle<0) {
    clickAngle+=TWO_PI
  }
  clickRadius = dist(width/2, height/2,x,y)
  for (key in mouseArcs) {
    if (clickAngle>mouseArcs[key].startAng && clickAngle<mouseArcs[key].endAng && clickRadius<r/2 && clickRadius>(r-donutWidth)/2) {
      selected=key
      break;
    }
  }
  pop();
  return selected
  
}

// Drawing text around circle like a sun
// push();
// rotate(angle/2)
// string = key.replace(/_|occupations/g, ' ')
// size = 15
// textSize(size)
// textDist = 5
// translate (r/2+textDist, 0)
// if (angleTotal>HALF_PI && angleTotal<HALF_PI+PI) {
//   translate (textWidth(string)-textDist,0)
//   rotate (PI)

// }
// text (string, 0, 0)
// pop();