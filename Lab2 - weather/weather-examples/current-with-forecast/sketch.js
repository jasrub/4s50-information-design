var forecastData;
var apiKey;

function setup() {
  createCanvas(400, 400);
  background(0);
  
  textAlign(CENTER, CENTER);
  fill(255);
}

function draw() {    
  background(0);
  
  if (forecastData && forecastData.currently && forecastData.hourly) {
    showCurrentWeather();
    showHourlyWeather();
  }
  
}

function showCurrentWeather() {
    // Temperature
    var temperatureString;
    if (forecastData.currently.temperature) {
      temperatureString = "The temperature is " +
        forecastData.currently.temperature + "° F.";
    }
    else {
      temperatureString = "The temperature is unavailable.";
    }
    text(temperatureString, width/2, height/8);
  
  
    // Relative Humidity
    var humidityString;
    if (forecastData.currently.humidity) {
      humidityString = "The relative humidity is " + 
        forecastData.currently.humidity*100 + "%.";
    }
    else {
      humidityString = "The relative humidity is unavailable.";
    }
    text(humidityString, width/2, 3*height/8);
  
    // Wind
    var windString;
    if (forecastData.currently.windSpeed && forecastData.currently.windBearing) {
      windString = "The wind speed is " + forecastData.currently.windSpeed + 
        " mph and the bearing is " + forecastData.currently.windBearing + "°.";
    }
    else {
      windString = "Wind information is unavailable.";
    }
    text(windString, width/2, 5*height/8);
  
  
    // Time
    var timeString = "This information was updated at " +
      nf(forecastData.currently.time.getHours(), 2) + ":" +
      nf(forecastData.currently.time.getMinutes(), 2) + ":" +
      nf(forecastData.currently.time.getSeconds(), 2) + " " +
      (forecastData.currently.time.getMonth()+1) + "/" +
      forecastData.currently.time.getDate() + "/" +
      forecastData.currently.time.getFullYear() + "."
      ".";
    text(timeString, width/2, 7*height/8);
  
}

function showHourlyWeather() {
  if (forecastData && forecastData.hourly) {
    var hourlyTemperature = [];
    var hourlyHumidity = [];
    var hourlyWindSpeed = [];
    for (var hourIndex = 0; hourIndex < forecastData.hourly.data.length; hourIndex++) {
      hourlyTemperature[hourIndex] = forecastData.hourly.data[hourIndex].temperature;
      hourlyHumidity[hourIndex] = forecastData.hourly.data[hourIndex].humidity;
      hourlyWindSpeed[hourIndex] = forecastData.hourly.data[hourIndex].windSpeed;
    }
    plotHourly(hourlyTemperature, height/4, height/8);
    plotHourly(hourlyHumidity, height/2, height/8);
    plotHourly(hourlyWindSpeed, 3*height/4, height/8);
  }

function plotHourly(data, ypos, height) {
    var minTemp = min(data);
    var maxTemp = max(data)
    
    push();
    stroke(255);
    noFill();
    beginShape();
    for (var hourIndex = 0; hourIndex < data.length; hourIndex++) {
      vertex(map(hourIndex, 0, data.length-1, 0, width),
            map(data[hourIndex], minTemp, maxTemp, ypos, ypos-height));
    }
    endShape();
    pop();
  }
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
  
  // Convenience function for formatting time
  function formatTime(timeField) {
      var d = new Date();
      d.setTime(timeField*1000);
      return d;
  }
}