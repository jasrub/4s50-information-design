var forecastData;
var apiKey // = '56525760cfd52dc2259d819ec189a9a4';
var balls = [];
var daysString = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

function setup() {
  createCanvas(677,375);
  background(0);
  
  textAlign(CENTER, CENTER);
  fill(255);
  makeBalls();
}

function draw() {
  background(255);
  fill(255);

  for (var i=0; i<balls.length; i++) { 
    balls[i].move(); 
    balls[i].display(); 
    fill(0);
    textSize(20);
    textStyle(BOLD);
    textFont("Helvetica");
    currTime =  new Date(forecastData.daily.data[i].time);
    text(daysString[Number(currTime.getDay())], balls[i].x, 12);
  }
}



function makeBalls() {
  if (forecastData && forecastData.hourly) {
    var dailyTemperatureMin = [];
    var dailyTemperatureMax = [];
    var dailyHumidity = [];
    var dailyWindSpeed = [];
    var dailyCloudCover = [];
    var dailyPrecipProbability = [];
    var dailyPrecipIntensity = [];
    var dailyVisibility = [];
    var numDays = forecastData.daily.data.length;
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
    for (var i = 0; i<numDays; i++) {
      var currBall = new Ball();
      currBall.x = width/numDays*i+width/numDays/2;
      currBall.bottomLimit = map(dailyTemperatureMin[i], min(dailyTemperatureMin), max(dailyTemperatureMin), height, height/2);
      currBall.topLimit = map(dailyTemperatureMax[i], min(dailyTemperatureMax), max(dailyTemperatureMax), height/2, 0)-currBall.diameter/2;
      currBall.diameter = map(dailyHumidity[i], 0,1,0.2, width/numDays-3);
      currBall.speed = map(dailyWindSpeed[i], min(dailyWindSpeed), max(dailyWindSpeed), 0.5, 5);
      currBall.b = map(dailyPrecipProbability[i], 0,1, 0, 255);
      currBall.g = map (dailyPrecipIntensity[i], min(dailyPrecipIntensity), max(dailyPrecipIntensity), 0, 255);
      currBall.r = map(dailyVisibility[i], min(dailyVisibility), max(dailyVisibility), 0, 255);
      currBall.opacity = map(dailyCloudCover[i], 0,1, 20, 255);
      balls.push(currBall)
    }
  }
}

// Ball class
function Ball() {
  this.x = 0;
  this.y = 0;
  this.diameter = 50;
  this.speed = 1;
  this.r = 255;
  this.g = 255;
  this.g = 255;
  this.opacitiy = 150;
  this.topLimit = 0;
  this.bottomLimit = height;

  this.move = function() {
    if (this.y > this.bottomLimit) {
      this.y=this.bottomLimit;
      this.speed = -this.speed;
    }
    if (this.y < this.topLimit) {
      this.y=this.topLimit;
      this.speed = -this.speed
    }
    this.y += this.speed;
    
  };

  this.display = function() {
    fill (this.r, this.g, this.b, this.opacity);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
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