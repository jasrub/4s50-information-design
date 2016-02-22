// Icons from Noun Project
// https://thenounproject.com/mockturtle/collection/full-weather-forecast-solid/
var forecastData;
var apiKey  = '56525760cfd52dc2259d819ec189a9a4';
var iconsDict = {};
var cloudCoverIcon;
var visibilityIcon;
var humidityIcon;
var windIcon;
var precipIcons = {};
var daysString = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
var masterColor;

function setup() {
  createCanvas(375, 677);
  textFont("Helvetica");
  imageMode(CENTER);
  textAlign(CENTER, CENTER); 
  masterColor = color ('rgb(36,122,125)');
}

function draw() {    
  background(255);
  stroke(80);
  push();
  scale(0.9);
  translate(width*0.05, height*0.05);
  
  var temp = forecastData.currently.temperature

  // Draw Icon
  push();
  //image(img,[sx=0],[sy=0],[sWidth=img.width],[sHeight=img.height],[dx=0],[dy=0],[dWidth],[dHeight])
  translate(width/2, width/2);
  img = iconsDict[forecastData.currently.icon][0];
  var imageScale = (width/4)/img.width
  push();
  
  scale(imageScale);
  // images should be white
  tint(36,122,125,150);  // Display at half opacity
  image(img);
  pop();
  
  
  // Show the temp and weather string
  noStroke();
  fill(0);
  
  push();
  var textsize = 18
  textSize(textsize);
  var textHeight = iconsDict[forecastData.currently.icon][1] * textsize
  text(round(temp)+"°F", 0, textHeight);
  text (forecastData.currently.summary,0, imageScale*(img.height/2)+textsize/2);
  pop();
  
  // Show the apperant Temp
  push();
  var feelsLike = forecastData.currently.apparentTemperature;

  text("Feels like: "+round(feelsLike)+"°F" ,0,imageScale*(img.height/2)+textsize*1.5)
  pop();
  
  // draw icons
  var iconsDist  = width/3
  var iconsScale = imageScale/1.3
  textStyle (BOLD);
  var opacMin = 20;
  var opacMax = 150;
  
  // cloud cover icon
  push();
  translate (-iconsDist, 0);
  scale(iconsScale);
  textSize (textsize/(iconsScale))
  text( round(forecastData.currently.cloudCover*100) + "%" , 0, cloudCoverIcon.height/5)
  textSize (textsize/(iconsScale)/2)
  text("cloud cover", 0, cloudCoverIcon.height/2)
  tint (0,0,0,map(forecastData.currently.cloudCover,0,1,opacMin,opacMax));
  image (cloudCoverIcon);
  pop();
  
  //visibility icon
  push();
  angleMode(DEGREES);
  var v = p5.Vector.fromAngle(radians(45));
  var vx = v.x;
  var vy = v.y;
  translate (vx*(-iconsDist), vy*(-iconsDist));
  scale(iconsScale);
  textSize (textsize/(iconsScale)/1.8)
  text( forecastData.currently.visibility + " Miles", 0,visibilityIcon.height/4)
  textSize (textsize/(iconsScale)/2)
  text( "Visibility", 0,visibilityIcon.height/2+textsize/(iconsScale)/4)
  tint(0,0,0,map(forecastData.currently.visibility,0,15,opacMin,opacMax));
  image(visibilityIcon);
  pop();
  
  //humidity icon
  push();
  translate (0, -iconsDist);
  scale(iconsScale);
  textSize (textsize/(iconsScale))
  text( forecastData.currently.humidity*100 + "%", 0,0)
  textSize (textsize/(iconsScale)/2)
  text( "Humidity", 0,humidityIcon.height/2+textsize/(iconsScale)/2)
  tint(0,0,0,map(forecastData.currently.humidity,0,1,opacMin,opacMax));
  image(humidityIcon);
  pop();
  
  //wind icon
  push();
  angleMode(RADIANS);
  var v = p5.Vector.fromAngle(radians(135));
  var vx = v.x;
  var vy = v.y;
  translate (vx*(-iconsDist), vy*(-iconsDist));
  scale(iconsScale);
  
  push();
  textSize (textsize/(iconsScale))
  text( forecastData.currently.windSpeed, 0,0)
  textSize (textsize/(iconsScale)/1.8)
  text("mph", 0,textsize/iconsScale)
  textSize (textsize/(iconsScale)/2)
  text( "wind speed", 0,windIcon.height/2+textsize/(iconsScale)/4)
  pop();
  
  // rotate icon to direction of wind
  angleMode(RADIANS);
  var angle = radians(forecastData.currently.windBearing);
  angle += PI/2
  var wind = p5.Vector.fromAngle(angle);
  
  rotate(wind.heading());
  tint(0,0,0,map(forecastData.currently.windSpeed,0,70,opacMin,opacMax));
  image(windIcon);

  pop();
  
  // precipitation icon
  precipIcon = getPrecipIcon(forecastData.currently.precipIntensity, forecastData.currently.precipType)
  push();
  translate (iconsDist, 0);
  scale(iconsScale);
  textSize (textsize/(iconsScale))
  text( forecastData.currently.precipProbability*100 + "%",0,0)
  textSize (textsize/(iconsScale)/2)
  text(precipIcon,0,precipIcons[precipIcon].height/2)
  tint (0,0,0,map(forecastData.currently.precipProbability,0,1,opacMin,opacMax));
  image (precipIcons[precipIcon]);
  pop();
  
  
  pop();

  push();
  //Move to part of screen under all icons
  translate(0,width/2+imageScale*(img.height/2)+textsize*2);
  var barColor1 = color('white')
  var barColor2 = color('white')
  var c = barColor1
  var numHours = 12
  var titlesColor = masterColor;
  // show the next hours
  textAlign(CENTER,CENTER)
  textSize(11);
  noStroke();
  var barWidth = width/numHours
  
  fill (c);
  rect(0,0,barWidth,height/4+5)
  
  fill(0);
  textStyle(BOLD);
  text("Now", barWidth/2 ,20);
  textStyle(NORMAL);
  fill(titlesColor);
  for (var i=1; i<numHours; i++) {
    i%2==0? c=barColor1 : c = barColor2;
    fill(c)
    rect(i*barWidth,0,barWidth,height/4+5)
    fill(titlesColor);
    currTime =  new Date(forecastData.hourly.data[i].time);
    text(hoursMinutes(currTime.getHours(),currTime.getMinutes()), i*barWidth +barWidth/2, 20)
  }
  
  //move under text
  translate (0, 50); //textSize+textSize+5
  
  //Write the temp
  push();
  tempHourlySize = barWidth/2
  textSize(tempHourlySize);
  fill(0)
  noStroke();
  var hourlyTempData = []
  for (var i=0; i<numHours; i++) {
    temp =  forecastData.hourly.data[i].temperature;
    text(round(temp)+"°", i*barWidth +barWidth/2, tempHourlySize*1.5)
    hourlyTempData[i] = temp
  }
  pop();
  
  plotHourly(hourlyTempData, 0, tempHourlySize)
  translate (0, tempHourlySize*2);
  
  // draw the weather icons 
  for (var i=0; i<numHours; i++) {
      currIcon = forecastData.hourly.data[i].icon;
      push();
      scaleFactor = barWidth/iconsDict[currIcon][0].width
      scale(scaleFactor);
      tint(36,122,125,150);
      image(iconsDict[currIcon][0], (i*barWidth+barWidth/2)/scaleFactor, iconsDict[currIcon][0].height/2)
      pop();
  }
  
  // draw the cloudCover
  push();
  scaleFactor = barWidth/cloudCoverIcon.width
  scale(scaleFactor);
  for (var i=0; i<numHours; i++) {
    tint(0,0,0, map(forecastData.hourly.data[i].cloudCover, 0, 1, 20, 220));
    image(cloudCoverIcon, (i*barWidth+barWidth/2)/scaleFactor, (cloudCoverIcon.height)*1.5)
  }
  pop();
  
  // draw precipitation icons
  
  for (var i=0; i<numHours; i++) {
    var intensity = forecastData.hourly.data[i].precipIntensity
    var type = forecastData.hourly.data[i].precipType
    var probability = forecastData.hourly.data[i].precipProbability
    precipIcon = getPrecipIcon(intensity, type)
    scaleFator = barWidth/precipIcons[precipIcon].width
    push();
    scale(scaleFactor)
    tint(0,0,0, map(probability, 0, 1, 20, 220));
    image(precipIcons[precipIcon], (i*barWidth+barWidth/2)/scaleFactor, (cloudCoverIcon.height)*2.5)
    pop();
  }
  pop();
  
  
    push();
  //Move to part of screen under all icons
  translate(0,height*31/48+3);
  
  var numHours = forecastData.daily.data.length
  var barColor1 = color('white')
  var barColor2 = color('white')
  var c = barColor1
  // show the next hours
  textAlign(CENTER,CENTER)
  textSize(11);
  textStyle(BOLD)
  noStroke();
  var barWidth = width/numHours
  fill (c);
  rect(0,0,barWidth,height/3)
  
  fill(0);
  text("Today", barWidth/2 ,20);

  fill(titlesColor);
  for (var i=1; i<numHours; i++) {
    i%2==0? c=barColor1 : c = barColor2;
    fill(c)
    rect(i*barWidth,0,barWidth,height/2)
    fill(titlesColor);
    currTime =  new Date(forecastData.daily.data[i].time);
    text(daysString[Number(currTime.getDay())], i*barWidth +barWidth/2, 20)
  }
  
  //move under text
  translate (0, 50); //textSize+textSize+5
  
  //Write the temp
  push();
  tempHourlySize = barWidth/2
  textSize(tempHourlySize/2);
  fill(0)
  noStroke();
  var hourlyTempData = []
  for (var i=0; i<numHours; i++) {
    minTemp =  forecastData.daily.data[i].temperatureMin;
    maxTemp = forecastData.daily.data[i].temperatureMax;
    avgTemp = minTemp+maxTemp/2
    text(round(maxTemp)+"°", i*barWidth +barWidth/2, tempHourlySize*0.5)
    text(round(minTemp)+"°", i*barWidth +barWidth/2, tempHourlySize*1.5)
    hourlyTempData[i] = avgTemp
  }
  pop();
  
  plotHourly(hourlyTempData, 0, tempHourlySize)
  translate (0, tempHourlySize*2);
  
  // draw the weather icons 
  for (var i=0; i<numHours; i++) {
      currIcon = forecastData.daily.data[i].icon;
      push();
      scaleFactor = barWidth/iconsDict[currIcon][0].width
      scale(scaleFactor);
      tint(36,122,125,150);
      image(iconsDict[currIcon][0], (i*barWidth+barWidth/2)/scaleFactor, iconsDict[currIcon][0].height/2)
      pop();
  }
  
  // draw the cloudCover
  push();
  scaleFactor = barWidth/cloudCoverIcon.width
  scale(scaleFactor);
  for (var i=0; i<numHours; i++) {
    tint(0,0,0, map(forecastData.daily.data[i].cloudCover, 0, 1, 20, 220));
    image(cloudCoverIcon, (i*barWidth+barWidth/2)/scaleFactor, (cloudCoverIcon.height)*1.5)
  }
  pop();
  
  // draw precipitation icons
  
  for (var i=0; i<numHours; i++) {
    var intensity = forecastData.daily.data[i].precipIntensity
    var type = forecastData.daily.data[i].precipType
    var probability = forecastData.daily.data[i].precipProbability
    precipIcon = getPrecipIcon(intensity, type)
    scaleFator = barWidth/precipIcons[precipIcon].width
    push();
    scale(scaleFactor)
    tint(0,0,0, map(probability, 0, 1, 20, 220));
    image(precipIcons[precipIcon], (i*barWidth+barWidth/2)/scaleFactor, (cloudCoverIcon.height)*2.5)
    pop();
  }
  

  
  pop();
  pop();
  
  
}


function plotHourly(data, ypos, height) {
    var minTemp = min(data);
    var maxTemp = max(data)
    
    push();
    stroke(0);
    fill(masterColor);
    beginShape();
    vertex (0, ypos)
    for (var hourIndex = 0; hourIndex < data.length; hourIndex++) {
      vertex(map(hourIndex, 0, data.length-1, 0, width),
            map(data[hourIndex], minTemp, maxTemp, ypos, ypos-height));
    }
    vertex(width, ypos)
    endShape();
    pop();
}

// return hours that read 1 through 12 rather than 0 through 23
function humanHour(hours) {
  var h = hours % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}


// format hours and minutes
function hoursMinutes(hours, minutes) {
  return nf(humanHour(hours), 2) + ':' + nf(minutes, 2);
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
  cloudCoverIcon = loadImage("icons/clouds.png");
  visibilityIcon = loadImage("icons/visibility.png");
  humidityIcon = loadImage("icons/humidity.png");
  windIcon = loadImage("icons/windIcon.png");
  
  precipIcons["no precip"] = loadImage("icons/precip/no_precip.png"); 
  precipIcons["light rain"] = loadImage("icons/precip/light_rain.png");
  precipIcons["heavy rain"] = loadImage("icons/precip/heavy_rain.png");
  precipIcons["light snow"] = loadImage("icons/precip/light_snow.png");
  precipIcons["heavy snow"] = loadImage("icons/precip/heavy_snow.png");
  precipIcons["light sleet"] = loadImage("icons/precip/light_sleet.png");
  precipIcons["heavy sleet"] = loadImage("icons/precip/heavy_sleet.png");
  precipIcons["light hail"] = loadImage("icons/precip/light_hail.png");
  precipIcons["heavy hail"] = loadImage("icons/precip/heavy_hail.png");
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
  iconsDict ["clear-day"] = [loadImage("icons/clear-day.png"), 0];
  iconsDict ["clear-night"] = [loadImage("icons/clear-night.png"), 1];
  iconsDict ["rain"] = [loadImage("icons/rain.png"), 0];
  iconsDict ["snow"] = [loadImage("icons/snow.png"), 0];
  iconsDict ["sleet"] = [loadImage("icons/sleet.png"), 0];
  iconsDict ["wind"] = [loadImage("icons/wind.png"), 0];
  iconsDict ["fog"] = [loadImage("icons/fog.png"), 0];
  iconsDict ["cloudy"] = [loadImage("icons/cloudy.png"), 0.5];
  iconsDict ["partly-cloudy-day"] = [loadImage("icons/cloudy-day.png"), 1];
  iconsDict ["partly-cloudy-night"] = [loadImage("icons/cloudy-night.png"),1];
  
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