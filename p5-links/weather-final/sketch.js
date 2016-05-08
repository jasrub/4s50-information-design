// Icons from Noun Project
// https://thenounproject.com/mockturtle/collection/full-weather-forecast-solid/
var forecastData;
var apiKey  = '56525760cfd52dc2259d819ec189a9a4';

var iconFont;

var iconsDict = {};
var precipIcons = {};
var moonIcons = {};

var cloudCoverIcon;
var visibilityIcon;
var humidityIcon;
var windIcon;
var tempIcon;

var daysString = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var numDays = 7;
var numRows = 8;
var minScale = 0.3;
var iconsColor;
var iconSize;
var centerX;
var bgColor;
var frameWidth;

var colWidth;
var rowHeight;

var dailyTemperatureMin = [];
var dailyTemperatureMax = [];
var dailyTemperatureAvg = [];
var dailyPrecipIntensity = [];
var dailyWindSpeed = [];
var dailyVisibility = [];

var isWeekly;
var clickedDay = 0;
var startAnimate;
var animationDone;
var resizingDone;
var addText = false;
var font = 'Helvetica';
var addedTextSize = 11;
var addedTextColor = 80;
var addedTextDist = 80;

var coldColor;
var warmColor;

var xDown = null;
var yDown = null;

function setup() {
  // height when adress bar is there
  createCanvas(375, 627);
  //createCanvas(375, 667);
  bgColor = color('rgba(36,122,125, 0.1)');
  coldColor = color('rgb(215, 243, 244)');
  warmColor = color ('rgb(242, 217, 229)');
  textFont(font);
  imageMode(CENTER);
  textAlign(CENTER, CENTER); 
  
  iconsColor = color(100, 100, 100);
  colWidth = width/numDays;
  rowHeight = height/numRows;
  isWeekly = true;

  getDailyData();
  //masterColor = color ('rgb(36,122,125)');
}

function draw() {    
  background(255);
  //background(255,255,242);
  if (isWeekly) {
    drawWeeklyView();
  }
  else {
    //background(bgColor);
    drawDayCol(clickedDay)
  }
}

// function mouseClicked() {
//   mouse = new p5.Vector(mouseX, mouseY);
//   if (isWeekly) {
//     changeToDaily(mouse.x);
//   }
//   else {
//     nextDay();
//   }
// }

// function keyPressed() {
//   if (keyCode === BACKSPACE) {
//     if (!isWeekly) {
//       changeToWeekly();
//     }
//   }
// }

function touchStarted() {  
  //console.log("touchStarted!!")
    xDown = touchX;                                      
    yDown = touchY;                                      
};  

function touchEnded() {
  //console.log("touchEnded!!")
    if ( ! xDown || ! yDown ) {
        return;
    }
    if(isWeekly) {
      changeToDaily(xDown);
      return;
    }

    var xUp = touchX;                                    
    var yUp = touchY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            if (!isWeekly) {
              console.log("left");
              nextDay();
            }
        } else {
            /* right swipe */
            if (!isWeekly) {
              console.log("right");
              prevDay();
            }
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
            console.log("down");
            if (!isWeekly) {
              changeToWeekly();
            }
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};
function changeToDaily(x) {
  if (isWeekly) {
    clickedDay = 0;
    xRange = colWidth
    while (x>xRange) {
      xRange+=colWidth;
      clickedDay++
    }
    frameWidth = colWidth;
    isWeekly = false;
    startAnimate = true;
    animationDone = false;
    resizingDone = false;
  }
}
function nextDay() {
  if(!isWeekly){
    clickedDay++;
    if (clickedDay>numDays-1) {
      clickedDay = 0;
    }
  }
}
function prevDay() {
  if(!isWeekly){
    clickedDay--;
    if (clickedDay<0) {
      clickedDay = numDays-1;
    }
  }
}
function changeToWeekly() {
  if (!isWeekly) {
    clickedDay = null;
    isWeekly = true;
    startAnimate = false;
    animationDone = true;
    resizingDone = true;
    addText = false;
  }
}


function drawWeeklyView (){
  for (var i=0; i<numDays; i++) {
    drawDayCol(i, true);
  }
}
function drawDayCol(i, isWeekly) {
  var rectPadding = 5;
  var textPadding = 5;
  colorValue = map(dailyTemperatureAvg[i], max(10, min(dailyTemperatureMin)), min(90, max(dailyTemperatureMax)),0,1);
  bgColor = lerpColor(coldColor, warmColor, colorValue);
  
  if (isWeekly) {
    drawRect(i, colWidth, rectPadding);
  }
  else {
    // if to animate rect stratching
    dailyRectWidth = width-rectPadding*2
    frameWidth = dailyRectWidth
    drawRect(i, frameWidth, rectPadding);
  }
  var heightIndex = 0;
  
  var tempIconSize = (colWidth-textPadding*2-rectPadding*2)
  var dayNameSize = iconSize/2.5;
  var tempCenterX = i*colWidth+colWidth/2;
  var centerY = function (heightIndex) {
    return heightIndex*rowHeight+rowHeight/2;
  }
  if (isWeekly) {
    iconSize = tempIconSize;
    centerX = tempCenterX;
  }
  if (!isWeekly) {
    var maxIconSize = rowHeight*0.95
    var xLocation = round(maxIconSize*1.5);
    if (startAnimate) {
      startAnimate = false;
      centerX = tempCenterX;
    }
    var goLeft = (i>1);
    if (goLeft) {
      if (centerX>xLocation) {
        centerX-=3
      }
      else {
        animationDone = true;
        centerX=xLocation;
      }
    }
    else {
      if (centerX<xLocation) {
        centerX+=3
      }
      else {
        animationDone = true;
        centerX=xLocation;
      }
    }
    //if (animationDone && iconSize<maxIconSize) {
    if (iconSize<maxIconSize) {
      iconSize *=1.02
    }
    else{
      resizingDone = true;
    }
    dayNameSize = iconSize/2.5;
    if (animationDone && resizingDone) {
      setTimeout(1000);
      addText = true;
    }
  }
  
  dayName(i, centerX, centerY(heightIndex), dayNameSize, iconSize);
  temp(i, centerX, centerY(++heightIndex), iconSize);
  precip(i, centerX, centerY(++heightIndex), iconSize);
  wind(i, centerX, centerY(++heightIndex), iconSize);
  humidity(i, centerX, centerY(++heightIndex), iconSize);
  visibility(i, centerX, centerY(++heightIndex), iconSize);
  cloudCover(i, centerX, centerY(++heightIndex), iconSize);
  moonPhase(i, centerX, centerY(++heightIndex), iconSize);
}
function drawRect(i, colWidth, rectPadding) {
  if (isWeekly) {
    rectStartX = i*colWidth+rectPadding
    rectStartY = 0+rectPadding
    rectWidth = colWidth-rectPadding*2
    rectHeight = height-rectPadding*2
    push();
      noStroke();
      fill (bgColor)
      rect (rectStartX,rectStartY, rectWidth, rectHeight)
    pop();
  }
  else {
    push();
    noStroke();
    fill (bgColor);
    rectMode(CENTER)
    rect (width/2,height/2, colWidth, height-rectPadding*2)
    pop();
  }
}
function dayName (i, centerX, centerY, size, iconSize) {
  push();
    noStroke();
    push();
    // draw icon under day name
    translate(centerX, centerY);
    rotate(radians(45));
    textSize(iconSize*0.9)
    textFont(iconFont);
    fill (red(iconsColor), green(iconsColor), blue(iconsColor), 30);
    text(iconsDict[forecastData.daily.data[i].icon], 0,0 )
    pop();
    
    
    fill(iconsColor)
    textFont(font);
    var dayDate = new Date(forecastData.daily.data[i].time);
    // Show one letter for day
    var dayNameSize = size*0.9
    var dayPrint = daysString[Number(dayDate.getDay())];
    //if weekly show just 1 letter:
    if (isWeekly) {
      dayPrint = dayPrint[0]
      textStyle(BOLD);
      dayNameSize = size*1.5;
    }
    // If it's today write today
    if (dayDate.getDate()== new Date(forecastData.currently.time).getDate()) {
      dayPrint="Today";
      dayNameSize = size;
      
    }
    textSize (dayNameSize);
    text(dayPrint, centerX, centerY);
    if (addText) {
      push();
      fill(addedTextColor)
      textAlign(LEFT, TOP)
      textSize(size/3);
      text(forecastData.daily.data[i].summary, (centerX-dayPrint.length*dayNameSize/4), centerY+size/1.5) 
      pop();
    }
  pop();
}

function temp(i, centerX, centerY, size) {
  push();
    fill(iconsColor)
    noStroke();
    var scaleFactor = map (dailyTemperatureAvg[i], min(dailyTemperatureAvg) ,max(dailyTemperatureAvg), minScale ,1) 
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(tempIcon, centerX, centerY)
  pop();
    if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      text("Max:   "+round(forecastData.daily.data[i].temperatureMax)+"°F", centerX+addedTextDist, centerY-size/5)
      text("Min:   "+round(forecastData.daily.data[i].temperatureMin)+"°F", centerX+addedTextDist, centerY+size/5) 
      pop();
    }
}
function precip(i, centerX, centerY, size) {
  push();
    var intensity = forecastData.daily.data[i].precipIntensity
    var type = forecastData.daily.data[i].precipType
    var currPrecipIcon = getPrecipIcon(intensity, type)
  
    var opacFactor = map(intensity, max(dailyPrecipIntensity), min(dailyPrecipIntensity), 200, 20)
    var scaleFactor = map (forecastData.daily.data[i].precipProbability, 0,1, minScale ,1) 
    
    fill(red(iconsColor), green(iconsColor), blue(iconsColor), opacFactor)
    noStroke();
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(precipIcons[currPrecipIcon], centerX, centerY)
  pop();
      if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      var precipString  = "No Precipitation"
      if (type) {
        precipString = round(forecastData.daily.data[i].precipProbability*100)+"%  chances of "+type
      }
      text(precipString, centerX+addedTextDist, centerY)
      pop();
    }
  
}
function wind(i, centerX, centerY, size) {
  push();
    translate(centerX, centerY)
    angleMode(RADIANS);
    var angle = radians(forecastData.daily.data[i].windBearing);
    angle += PI/2
    var wind = p5.Vector.fromAngle(angle);
    rotate(wind.heading());
    fill(iconsColor)
    noStroke();
    var scaleFactor = map (dailyWindSpeed[i], min(dailyWindSpeed)-10, max(dailyWindSpeed), minScale ,1) 
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(windIcon, 0,0)
  pop();
  if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      text("Wind speed:  "+forecastData.daily.data[i].windSpeed+"  mph", centerX+addedTextDist, centerY)
      pop();
  }
  
}
function humidity(i, centerX, centerY, size) {
  push();
    fill(iconsColor)
    noStroke();
    var scaleFactor = map (forecastData.daily.data[i].humidity,0,1,minScale,1) 
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(humidityIcon, centerX, centerY)
  pop();
    if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      text("Humidity:  "+round(forecastData.daily.data[i].humidity*100)+"%", centerX+addedTextDist, centerY)
      pop();
    }
}
function visibility(i, centerX, centerY, size) {
  push();
    fill(iconsColor)
    noStroke();
    var scaleFactor = map (dailyVisibility[i], min(dailyVisibility)-10 ,max(dailyVisibility),minScale,1) 
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(visibilityIcon, centerX, centerY)
  pop();
  if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      var visString = "no visibility data"
      if (dailyVisibility[i]) {
        visString = "Visibility:  "+dailyVisibility[i] + " Miles"
      }
      text(visString, centerX+addedTextDist, centerY)
      pop();
    }
  
  
}
function cloudCover(i, centerX, centerY, size) {
  push();
    fill(iconsColor)
    noStroke();
    var scaleFactor = map (forecastData.daily.data[i].cloudCover,0,1,minScale,1) 
    textSize(scaleFactor*size)
    textFont(iconFont);
    text(cloudCoverIcon, centerX, centerY)
  pop();
      if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      text("Cloud cover:  "+round(forecastData.daily.data[i].cloudCover*100)+"%", centerX+addedTextDist, centerY)
      pop();
    }
}
function moonPhase(i, centerX, centerY, size) {
  push();
    fill(iconsColor)
    noStroke();
    textSize(size*0.8)
    textFont(iconFont);
    text(moonIcons[round(forecastData.daily.data[i].moonPhase*10)], centerX, centerY)
  pop();
  if (addText) {
      push();
      fill(addedTextColor)
      noStroke();
      textFont(font);
      textAlign(LEFT, CENTER)
      textSize(addedTextSize);
      text("Moon Phase:  "+round(forecastData.daily.data[i].moonPhase*100)+"%", centerX+addedTextDist, centerY)
      pop();
  }
}



function getDailyData() {
  if (forecastData && forecastData.daily) {
    for (var dayIndex = 0; dayIndex < numDays; dayIndex++) {
      dailyTemperatureMin[dayIndex] = forecastData.daily.data[dayIndex].temperatureMin;
      dailyTemperatureMax[dayIndex] = forecastData.daily.data[dayIndex].temperatureMax;
      dailyTemperatureAvg[dayIndex] = (dailyTemperatureMin[dayIndex] + dailyTemperatureMax[dayIndex])/2;
      dailyPrecipIntensity[dayIndex] = forecastData.daily.data[dayIndex].precipIntensity;
      dailyWindSpeed[dayIndex] = forecastData.daily.data[dayIndex].windSpeed;
      dailyVisibility[dayIndex] = forecastData.daily.data[dayIndex].visibility? forecastData.daily.data[dayIndex].visibility:0;
    }
  }
}

//-- You can ignore everything past this point if you'd like --//

function preload() {
  if (apiKey) {
    var url = 'https://api.forecast.io/forecast/'
            + apiKey + '/42.3736,-71.1106';
    loadJSON(url, loadCallback, 'jsonp');
  }
  else {
    loadJSON('cachedForecastForBoston.json', loadCallback);
  }
  loadIcons();
}

function getPrecipIcon (intensity, type) {
  var light = false;
  var iconName
  if (intensity==0) {
    iconName = "no precip";
  }
  else {
    if (intensity<0.2){
      light=true;
    }
    light ? iconName = "light "+type : iconName = "heavy "+type;
  }
  return iconName;
}

function loadIcons() {
  iconFont = loadFont("fontello.ttf");
  
  cloudCoverIcon = "";
  visibilityIcon = ""; //replace?
  humidityIcon = "";
  windIcon = "";
  tempIcon = "";
  
  iconsDict ["clear-day"] = "";
  iconsDict ["clear-night"] = "";
  iconsDict ["rain"] = "";
  iconsDict ["snow"] = "";
  iconsDict ["sleet"] = "";
  iconsDict ["wind"] = "";
  iconsDict ["fog"] = "";;
  iconsDict ["cloudy"] = "";
  iconsDict ["partly-cloudy-day"] = "";
  iconsDict ["partly-cloudy-night"] = "";
  
  precipIcons["no precip"] = ""; 
  precipIcons["light rain"] = "";
  precipIcons["heavy rain"] = "";
  precipIcons["light snow"] = "";
  precipIcons["heavy snow"] = "";
  precipIcons["light sleet"] = "";
  precipIcons["heavy sleet"] = "";
  precipIcons["light hail"] = "";
  precipIcons["heavy hail"] = "";
  
  moonIcons[0] = "";
  moonIcons[1] = "";
  moonIcons[2] = ""; 
  moonIcons[3] = ""; 
  moonIcons[4] = ""; 
  moonIcons[5] = ""; 
  moonIcons[6] = ""; 
  moonIcons[7] = ""; 
  moonIcons[8] = ""; 
  moonIcons[9] = ""; 
  moonIcons[10] = ""; 
}

function loadCallback(data) {
  forecastData = data;
  
  // Reformat current date
  if (forecastData.currently) {
    forecastData.currently.time =
      formatTime(forecastData.currently.time);
  }
  
  // Reformat minute date
  if (forecastData.minutely && forecastData.minutely.data) {
    for (minuteIdx = 0; minuteIdx < forecastData.minutely.data.length; minuteIdx++) {
      forecastData.minutely.data[minuteIdx].time = 
        formatTime(forecastData.minutely.data[minuteIdx].time);
    }
  }
  
  // Reformat hourly date
  if (forecastData.hourly && forecastData.hourly.data) {
    for (hourIdx = 0; hourIdx < forecastData.hourly.data.length; hourIdx++) {
      forecastData.hourly.data[hourIdx].time = 
        formatTime(forecastData.hourly.data[hourIdx].time);
    }
  }
  
  // Reformat daily date
  if (forecastData.daily && forecastData.daily.data) {
    var dailyData = forecastData.daily.data
    for (dayIdx = 0; dayIdx < dailyData.length; dayIdx++) {
      dailyData[dayIdx].time = 
        formatTime(dailyData[dayIdx].time);
      
      // sunrise
      if (dailyData[dayIdx].sunriseTime) {
        dailyData[dayIdx].sunriseTime =
          formatTime(dailyData[dayIdx].sunriseTime);
      }
      
      // sunset
      if (dailyData[dayIdx].sunsetTime) {
        dailyData[dayIdx].sunsetTime =
          formatTime(dailyData[dayIdx].sunsetTime);
      }
      
      // max precipitation time
      if (dailyData[dayIdx].precipIntensityMaxTime) {
        dailyData[dayIdx].precipIntensityMaxTime = 
        formatTime(dailyData[dayIdx].precipIntensityMaxTime);
      }
      
      // min temp time
      if (dailyData[dayIdx].temperatureMinTime) {
        dailyData[dayIdx].temperatureMinTime = 
        formatTime(dailyData[dayIdx].temperatureMinTime);
      }
      
      // max temp time
      if (dailyData[dayIdx].temperatureMaxTime) {
        dailyData[dayIdx].temperatureMaxTime = 
        formatTime(dailyData[dayIdx].temperatureMaxTime);
      }
      
      // apparent min temp time
      if (dailyData[dayIdx].apparentTemperatureMinTime) {
        dailyData[dayIdx].apparentTemperatureMinTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMinTime);
      }
      
      // apparent max temp time
      if (dailyData[dayIdx].apparentTemperatureMaxTime) {
        dailyData[dayIdx].apparentTemperatureMaxTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMaxTime);
      }
    }
  }
  
  // Reformat alerts date
  if (forecastData.alerts) {
    for (alertIdx = 0; alertIdx < forecastData.alerts.length; alertIdx++) {
      forecastData.alerts[alertIdx].time = 
        formatTime(forecastData.alerts[alertIdx].time);
    }
  }
  
  // Convenience method for formatting time
  function formatTime(timeField) {
      var d = new Date();
      d.setTime(timeField*1000);
      return d;
  }
}