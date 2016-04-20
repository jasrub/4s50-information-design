var forecastData;
var apiKey;

var idxToShow = 0;
var pause = 0;
var animate = true;

function setup() {
  createCanvas(400, 400);
  leftBound = width/2;
  rightBound = width/2;
  textAlign(CENTER, CENTER);
  fill(255);
}

function draw() {    
  background(0);
  
  var hourlyTemp = [];

  for(var hourIndex = 0; hourIndex < forecastData.hourly.data.length;   
      hourIndex++) {
    hourlyTemp[hourIndex] =
      forecastData.hourly.data[hourIndex].temperature;
  }
  
  var minTemp = min(hourlyTemp);
  var maxTemp = max(hourlyTemp);
  
    
  push();
  beginShape();
  noFill();
  stroke(255);
  for (var hourIndex = 0; hourIndex < forecastData.hourly.data.length;
    hourIndex++) {
      vertex(map(hourIndex,
                0, forecastData.hourly.data.length - 1, 0, width),
             map(hourlyTemp[hourIndex], minTemp, maxTemp, height, 0));
  }
  endShape();
  pop();
  
  // Draw text on line plot
  push();
  textAlign(LEFT, CENTER);
  text(hourlyTemp[idxToShow] + "° F",
      map(idxToShow,
          0, forecastData.hourly.data.length - 1, 0, width),
      map(hourlyTemp[idxToShow], minTemp, maxTemp, height, 0))
  pop();
  
  // Update animation frame
  if (animate) {
    if (pause > 10) {
      pause = 0;
      idxToShow = (idxToShow+1)%hourlyTemp.length
    }
    else {
      pause++
    }
  }
}

function mouseClicked() {
  animate = !animate;
}

//-- You can ignore everything past this point if you'd like --//

function preload() {
  if (apiKey) {
    var url = 'https://api.forecast.io/forecast/'
            + apiKey + '/42.358429,-71.059769';
    loadJSON(url, loadCallback, 'jsonp');
  }
  else {
    loadJSON('cachedForecastForBoston.json', loadCallback);
  }
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