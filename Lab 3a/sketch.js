// Icons from Noun Project
// https://thenounproject.com/mockturtle/collection/full-weather-forecast-solid/
var forecastData;
var apiKey  = '56525760cfd52dc2259d819ec189a9a4';
var iconsDict = {};
var cloudCoverIcon;
var visibilityIcon;
var humidityIcon;
var windIcon;
var tempIcon;
var precipIcons = {};
var moonIcons = {};
var daysString = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
var masterColor;
var dailyState = true;
var dayToShow = 0;
var icons = [];
var animate = false;
var scaleCount = 0;
var factor = 1;
var iconFont;

function setup() {
  createCanvas(375, 677);
  textFont("Helvetica");
  imageMode(CENTER);
  textAlign(CENTER, CENTER); 
  daysString[Number(new Date(forecastData.currently.time).getDay())] = "Today"
  masterColor = color ('rgb(36,122,125)');
}

function draw() {    
  background(255);
  background(255,255,242);
  icons = [];
  if (dailyState) {
    var scaleAll = 0.6
    push();
    translate(width*(1-scaleAll)/2, height*(1-scaleAll)/2);
    scale(scaleAll);
    //fill(0);
    plotDailyIcons();
    for (var i=0; i<icons.length; i++) {
      icons[i].display();
    }
    pop();
  }
  if (animate && scaleCount<10) {
    scale(factor)
    scaleCount++;
  }
  if (scaleCount>=10 || !animate) {
    factor = 1;
    animate = false;
  }
}

function mouseClicked() {
  mouse = new p5.Vector(mouseX, mouseY);
  var clickedDay = 0;
  var i=0
  var barWidth = (width/forecastData.daily.data.length);
  xRange = barWidth
  while (mouseX>xRange) {
    xRange+=barWidth;
    i++
  }
  console.log(xRange+" "+barWidth+" "+i)
  animate = !animate;
  //dailyState=false;
  factor = 1.1;
  scaleCount = 0;
}


function plotDailyIcons() {
  if (forecastData && forecastData.daily) {
    var dailyTemperatureMin = [];
    var dailyTemperatureMax = [];
    var dailyTemperatureAvg = [];
    var dailyHumidity = [];
    var dailyWindSpeed = [];
    var dailyCloudCover = [];
    var dailyPrecipProbability = [];
    var dailyPrecipIntensity = [];
    var dailyVisibility = [];
    var dailyMoonPhase = [];
    
    var dailyApparentTemperatureMin = [];
    var dailyApparentTemperatureMax = [];
    var dailySunrise = [];
    var dailySunset = [];
    
    var numDays = forecastData.daily.data.length;
    var numIcons = 6;
    var dayWidth = width/numDays;
    var iconsHeight = height/numIcons;
    
    for (var dayIndex = 0; dayIndex < numDays; dayIndex++) {
      dailyTemperatureMin[dayIndex] = forecastData.daily.data[dayIndex].temperatureMin;
      dailyTemperatureMax[dayIndex] = forecastData.daily.data[dayIndex].temperatureMax;
      dailyTemperatureAvg[dayIndex] = (dailyTemperatureMin[dayIndex] + dailyTemperatureMax[dayIndex])/2
      dailyHumidity[dayIndex] = forecastData.daily.data[dayIndex].humidity;
      dailyWindSpeed[dayIndex] = forecastData.daily.data[dayIndex].windSpeed;
      dailyCloudCover[dayIndex] = forecastData.daily.data[dayIndex].cloudCover;
      dailyPrecipProbability[dayIndex] = forecastData.daily.data[dayIndex].precipProbability;
      dailyPrecipIntensity[dayIndex] = forecastData.daily.data[dayIndex].precipIntensity;
      dailyMoonPhase[dayIndex] = forecastData.daily.data[dayIndex].moonPhase;
      dailyVisibility[dayIndex] = forecastData.daily.data[dayIndex].visibility? forecastData.daily.data[dayIndex].visibility:0;
    }
    var iconSize = 500;
    var rowHeight = height/7;
    var scaleFactor = min(dayWidth,rowHeight)*0.6;
    for (var i = 0; i<numDays; i++) {
      var dailyTempIcon =  new Icon((i*dayWidth)+(dayWidth/2), 0*rowHeight+rowHeight/2, tempIcon, scaleFactor, 0, 0, 0,dailyTemperatureAvg[i], min(dailyTemperatureAvg) ,max(dailyTemperatureAvg), false, 0, 180);
      var dailyCloudIcon = new Icon((i*dayWidth)+(dayWidth/2), 5*rowHeight+rowHeight/2, cloudCoverIcon, scaleFactor, 0, 0, 0,dailyCloudCover[i], 0,1, false, 0, 180 );
      var dailyWindIcon = new Icon((i*dayWidth)+(dayWidth/2), 2*rowHeight+rowHeight/2, windIcon, scaleFactor, 0, 0, 0,dailyWindSpeed[i], min(dailyWindSpeed)-10 ,max(dailyWindSpeed), true, forecastData.daily.data[i].windBearing, 180 );
      var dailyHumidityIcon = new Icon((i*dayWidth)+(dayWidth/2), 3*rowHeight+rowHeight/2, humidityIcon, scaleFactor, 0, 0, 0,dailyHumidity[i], 0,1, false, 0, 180 );
      var dailyVisibilityIcon = new Icon((i*dayWidth)+(dayWidth/2), 4*rowHeight+rowHeight/2, visibilityIcon, scaleFactor, 0, 0, 0,dailyVisibility[i], min(dailyVisibility)-10 ,max(dailyVisibility), false, 0, 180 );
      var intensity = forecastData.daily.data[i].precipIntensity
      var type = forecastData.daily.data[i].precipType
      var currPrecipIcon = getPrecipIcon(intensity, type)
      var dailyPrecipStatIcon = new Icon((i*dayWidth)+(dayWidth/2), 1*rowHeight+rowHeight/2, precipIcons[currPrecipIcon] ,scaleFactor, 0, 0, 0, dailyPrecipProbability[i], 0,1, false, 0, map(intensity, max(dailyPrecipIntensity), min (dailyPrecipIntensity), 60, 190) );
      var dailyMoonPhaseIcon = new Icon((i*dayWidth)+(dayWidth/2), 6*rowHeight+rowHeight/2, moonIcons[round(dailyMoonPhase[i]*10)] ,scaleFactor, 0, 0, 0, 1,0,1, false, 0, 180 );
      icons.push(dailyTempIcon)
      icons.push(dailyCloudIcon)
      icons.push(dailyWindIcon)
      icons.push(dailyHumidityIcon)
      icons.push(dailyVisibilityIcon)
      icons.push(dailyPrecipStatIcon)
      icons.push(dailyMoonPhaseIcon);
      push();
        fill(0);
        noStroke();
        text(daysString[Number(new Date(forecastData.daily.data[i].time).getDay())], (i*dayWidth)+(dayWidth/2), 0*rowHeight-40);
      pop();
    }
  }
}

// Icon Class
var minOpac = 20;
var maxOpac = 220;
function Icon(x,y,img,scaleFactor,r,g,b,value,mapMin,mapMax, isRotate, angle, opacity) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.scaleFactor = scaleFactor;
  this.r = r;
  this.g = g;
  this.b = b;
  this.value = value;
  this.mapMin = mapMin;
  this.mapMax = mapMax;
  this.isRotate = isRotate;
  this.angle = angle;
  this.opacity = opacity

  this.display = function() {
    push();
      translate (this.x, this.y)
      var scaleMore = map(this.value, this.mapMin, this.mapMax, 0.5, 1.5) * this.scaleFactor
      textSize(scaleMore);
      //var opacity = map(this.value, this.mapMin, this.mapMax, minOpac, maxOpac);
      // rotate icon to direction of wind
      if (this.isRotate) {
        angleMode(RADIANS);
        var angle = radians(this.angle);
        angle += PI/2
        var wind = p5.Vector.fromAngle(angle);
        rotate(wind.heading());
      }

      //fill(this.r,this.g, this.b, this.opacity);
      fill(83,88,89, this.opacity);
      noStroke();
      textFont(iconFont);
      text(this.img, 0,0)
    pop();
  };
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
  // cloudCoverIcon = loadImage("icons/clouds.png");
  // visibilityIcon = loadImage("icons/visibility.png");
  // humidityIcon = loadImage("icons/humidity.png");
  // windIcon = loadImage("icons/windIcon.png");
  // tempIcon = loadImage("icons/temp.png");
  
  // iconsDict ["clear-day"] = [loadImage("icons/clear-day.png"), 0];
  // iconsDict ["clear-night"] = [loadImage("icons/clear-night.png"), 1];
  // iconsDict ["rain"] = [loadImage("icons/rain.png"), 0];
  // iconsDict ["snow"] = [loadImage("icons/snow.png"), 0];
  // iconsDict ["sleet"] = [loadImage("icons/sleet.png"), 0];
  // iconsDict ["wind"] = [loadImage("icons/wind.png"), 0];
  // iconsDict ["fog"] = [loadImage("icons/fog.png"), 0];
  // iconsDict ["cloudy"] = [loadImage("icons/cloudy.png"), 0.5];
  // iconsDict ["partly-cloudy-day"] = [loadImage("icons/cloudy-day.png"), 1];
  // iconsDict ["partly-cloudy-night"] = [loadImage("icons/cloudy-night.png"),1];
  
  // precipIcons["no precip"] = loadImage("icons/precip/no_precip.png"); 
  // precipIcons["light rain"] = loadImage("icons/precip/light_rain.png");
  // precipIcons["heavy rain"] = loadImage("icons/precip/heavy_rain.png");
  // precipIcons["light snow"] = loadImage("icons/precip/light_snow.png");
  // precipIcons["heavy snow"] = loadImage("icons/precip/heavy_snow.png");
  // precipIcons["light sleet"] = loadImage("icons/precip/light_sleet.png");
  // precipIcons["heavy sleet"] = loadImage("icons/precip/heavy_sleet.png");
  // precipIcons["light hail"] = loadImage("icons/precip/light_hail.png");
  // precipIcons["heavy hail"] = loadImage("icons/precip/heavy_hail.png");
  
  // moonIcons[0] = loadImage("icons/moon/moon_0.png");
  // moonIcons[1] = loadImage("icons/moon/moon_1.png");
  // moonIcons[2] = loadImage("icons/moon/moon_2.png"); 
  // moonIcons[3] = loadImage("icons/moon/moon_3.png"); 
  // moonIcons[4] = loadImage("icons/moon/moon_4.png"); 
  // moonIcons[5] = loadImage("icons/moon/moon_5.png"); 
  // moonIcons[6] = loadImage("icons/moon/moon_6.png"); 
  // moonIcons[7] = loadImage("icons/moon/moon_7.png"); 
  // moonIcons[8] = loadImage("icons/moon/moon_8.png"); 
  // moonIcons[9] = loadImage("icons/moon/moon_9.png"); 
  // moonIcons[10] = loadImage("icons/moon/moon_10.png"); 
  
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