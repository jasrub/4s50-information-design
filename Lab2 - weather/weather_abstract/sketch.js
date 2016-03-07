var forecastData;
var apiKey  = '56525760cfd52dc2259d819ec189a9a4';
var pause;

function setup() {
  createCanvas(375,677);
  background(0);
  pause=0;
  
  textAlign(CENTER, CENTER);
  fill(255);
}

function draw() {    
  background(0);
  if (forecastData && forecastData.currently && forecastData.hourly) {
    HourlyWeatherInCircles();
    showHourlyWeather()
    dailyWeatherInCircles()
  }
  
}
function showHourlyWeather() {
  if (forecastData && forecastData.hourly) {
    var hourlyTemperature = [];
    var tempSum=0;
    var hourlyHumidity = [];
    var humiditySum = 0;
    var hourlyWindSpeed = [];
    var windSpeedSum = 0;
    for (var hourIndex = 0; hourIndex < forecastData.hourly.data.length; hourIndex++) {
      hourlyTemperature[hourIndex] = forecastData.hourly.data[hourIndex].temperature;
      tempSum+=forecastData.hourly.data[hourIndex].temperature;
      hourlyHumidity[hourIndex] = forecastData.hourly.data[hourIndex].humidity;
      humiditySum+=forecastData.hourly.data[hourIndex].humidity;
      hourlyWindSpeed[hourIndex] = forecastData.hourly.data[hourIndex].windSpeed;
      windSpeedSum+=forecastData.hourly.data[hourIndex].windSpeed;
    }
    plotHourly(hourlyTemperature, tempSum, height/4, height/8);
    plotHourly(hourlyHumidity, humiditySum, height/2, height/8);
    plotHourly(hourlyWindSpeed, windSpeedSum, 3*height/4, height/8);
  }

function plotHourly(data, sum, ypos, height) {
    var minTemp = min(data);
    var maxTemp = max(data)
    
    push();
    noStroke();
    fill(255);
    var lastRadius = 0;
    var rad;
    for (var hourIndex = 0; hourIndex < data.length; hourIndex++) {
      rad = round(map(data[hourIndex], 0, sum, 0,  width));
      ellipse(lastRadius, ypos, rad,rad)
      lastRadius += rad;
    }
    pop();
  }
}

function HourlyWeatherInCircles() {
  if (forecastData && forecastData.hourly) {
    var hourlyTemperature = [];
    var hourlyHumidity = [];
    var hourlyWindSpeed = [];
    var hourlyCloudCover = [];
    var hourlyPrecipProbability = [];
    var hourlyPrecipIntensity = [];
    var hourlyVisibility = [];
    for (var hourIndex = 0; hourIndex < forecastData.hourly.data.length; hourIndex++) {
      hourlyTemperature[hourIndex] = forecastData.hourly.data[hourIndex].temperature;
      hourlyHumidity[hourIndex] = forecastData.hourly.data[hourIndex].humidity;
      hourlyWindSpeed[hourIndex] = forecastData.hourly.data[hourIndex].windSpeed;
      hourlyCloudCover[hourIndex] = forecastData.hourly.data[hourIndex].cloudCover;
      hourlyPrecipProbability[hourIndex] = forecastData.hourly.data[hourIndex].precipProbability;
      hourlyPrecipIntensity[hourIndex] = forecastData.hourly.data[hourIndex].precipIntensity;
      hourlyVisibility[hourIndex] = forecastData.hourly.data[hourIndex].visibility;
    }
    plotHourly(hourlyTemperature, hourlyHumidity, hourlyWindSpeed, width/2, width/2, height/3);
    plotHourly(hourlyPrecipProbability, hourlyCloudCover, hourlyVisibility, width/2, width/2, height*2/3);
  }

function plotHourly(data1, data2, data3, circleWidth, xpose, ypose) {
    var min1 = min(data1);
    var max1 = max(data1)
    var min2 = min(data2);
    var max2 = max(data2)
    var min3 = min(data3);
    var max3 = max(data3)
    push();
    strokeWidth = circleWidth/(2*data1.length)
    strokeWeight(strokeWidth)
    noFill();
    var rad = circleWidth-2*strokeWidth
    for (var hourIndex = 0; hourIndex < data1.length; hourIndex++) {
      var r = map(data1[hourIndex],min1, max1, 0,255)
      var g = map(data2[hourIndex],min2, max2, 0,255)
      var b = map(data3[hourIndex],min3, max3, 0,255)
      var c = color(r,g,b)
      stroke(c)
      ellipse(xpose, ypose, rad,rad)
      rad-=strokeWidth*2
    }
    pop();
  }
}

function showOnPlot (data, idxToShow, radius)  {
  // Draw text on line plot
  push();
  textAlign(LEFT, CENTER);
  text(hourlyTemp[idxToShow] + "° F",
      map(idxToShow,
          0, data.length - 1, 0, width),
      map(data[idxToShow], minTemp, maxTemp, height, 0))
  pop();
  
  // Update animation frame
  if (pause > 10) {
      pause = 0;
      idxToShow = (idxToShow+1)%hourlyTemp.length
  }
  else {
      pause++
  }
}

function dailyWeatherInCircles() {
  if (forecastData && forecastData.hourly) {
    var dailyTemperatureMin = [];
    var dailyTemperatureMax = [];
    var dailyHumidity = [];
    var dailyWindSpeed = [];
    var dailyCloudCover = [];
    var dailyPrecipProbability = [];
    var dailyPrecipIntensity = [];
    var dailyVisibility = [];
    for (var dayIndex = 0; dayIndex < forecastData.daily.data.length; dayIndex++) {
      dailyTemperatureMin[dayIndex] = forecastData.daily.data[dayIndex].temperatureMin;
      dailyTemperatureMax[dayIndex] = forecastData.daily.data[dayIndex].temperatureMax;
      dailyHumidity[dayIndex] = forecastData.daily.data[dayIndex].humidity;
      dailyWindSpeed[dayIndex] = forecastData.daily.data[dayIndex].windSpeed;
      dailyCloudCover[dayIndex] = forecastData.daily.data[dayIndex].cloudCover;
      dailyPrecipProbability[dayIndex] = forecastData.daily.data[dayIndex].precipProbability;
      dailyPrecipIntensity[dayIndex] = forecastData.daily.data[dayIndex].precipIntensity;
      dailyVisibility[dayIndex] = forecastData.daily.data[dayIndex].visibility? forecastData.daily.data[dayIndex].visibility:0;
    }
    plotHourly(dailyTemperatureMin, dailyHumidity, dailyWindSpeed, width/4, width/4, height/3);
    plotHourly(dailyPrecipProbability, dailyCloudCover, dailyVisibility, width/4, width*3/4, height/3);
  }

function plotHourly(data1, data2, data3, circleWidth, xpose, ypose) {
    var min1 = min(data1);
    var max1 = max(data1)
    var min2 = min(data2);
    var max2 = max(data2)
    var min3 = min(data3);
    var max3 = max(data3)
    push();
    strokeWidth = circleWidth/(2*data1.length)
    strokeWeight(strokeWidth)
    noFill();
    var rad = circleWidth-2*strokeWidth
    for (var hourIndex = 0; hourIndex < data1.length; hourIndex++) {
      var r = map(data1[hourIndex],min1, max1, 0,255)
      var g = map(data2[hourIndex],min2, max2, 0,255)
      var b = map(data3[hourIndex],min3, max3, 0,255)
      var c = color(r,g,b)
      stroke(c)
      ellipse(xpose, ypose, rad,rad)
      rad-=strokeWidth*2
    }
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
  
  // Convenience method for formatting time
  function formatTime(timeField) {
      var d = new Date();
      d.setTime(timeField*1000);
      return d;
  }
}