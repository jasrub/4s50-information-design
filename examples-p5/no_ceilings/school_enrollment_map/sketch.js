var canvasWidth = 1024;
var canvasHeight = 768;

var firstYear = 1990;
var lastYear = 2014;

var years = [];
for (var i = firstYear; i <= lastYear; i++) {
  years.push(i);
}

var data = {};
for (var i = 0; i < years.length; i++) {
  data[years[i]] = {
    primary:   { countries: {}, max: 0, min: Number.MAX_VALUE },
    secondary: { countries: {}, max: 0, min: Number.MAX_VALUE }
  };
}

var tables = {},
    yearWidth = (canvasWidth - 100) / years.length,
    yearHeight = 40,
    selectedYear = 2012,
    showPrimary = true,
    lo, hi;

// Initialize DOM elements
$(document).ready(function() {
  $.get("world.svg", function(data) {

    // Map
    $("body").append(data);
    $("svg")
      .attr("id", "map")
      .css({"width": canvasWidth, "position": "absolute", "left": "0px"}
    );

    // Timeline label
    $("body").append( $("<div>")
      .attr("id", "year")
      .text(selectedYear)
    );

    // Category label
    $("body").append( $("<div>")
      .attr("id", "category")
      .css({"text-align": "center", "width": canvasWidth})
      .text("Primary school enrollment (female)")
    );
  }, "text");
});

function fillCountry(country, color) {
  // Some countries are one path element
  $("path#" + country.toLowerCase()).css("fill", color);

  // Others are multiple path elements inside a g element
  $("g#" + country.toLowerCase()).children().css("fill", color);
}

function preload() {

  // Load data from .csv files
  for (var i = 0; i < years.length; i++) {
    tables[years[i]] = loadTable("data/" + years[i] + ".csv", "csv", "header");
  }
}

function setup() {

  createCanvas(canvasWidth, canvasHeight);

  colorMode(RGB, 255, 255, 255, 1);
  lo = color(3, 67, 83, .9),
  hi = color(65, 247, 180, .9);

  // Reorganize data
  for (var i = 0; i < years.length; i++) {
    var year = years[i];
    for (var j = 0; j < tables[year].getRowCount(); j++) {

      var country = tables[year].getRow(j).get("ISO 3166-1 alpha-3");  
      var primary = parseFloat(tables[year].getRow(j).get("Primary school"));
      var secondary = parseFloat(tables[year].getRow(j).get("Secondary school")); 

      data[year].primary.countries[country] = primary;
      data[year].secondary.countries[country] = secondary;
      data[year].primary.max = max(primary, data[year].primary.max);
      if (primary != -9) {
        data[year].primary.min = min(primary, data[year].primary.min);
      }
      data[year].secondary.max = max(secondary, data[year].secondary.max);
      if (secondary != -9) {
        data[year].secondary.min = min(secondary, data[year].secondary.min);
      }
    }
  }

}

function draw() {
  background(255);

  var mapHeight = $("#map").height();

  // Select year
  if (mouseX > 50 
   && mouseX < 50 + (years.length - 1) * yearWidth
   && mouseY > mapHeight - 10
   && mouseY < mapHeight + yearHeight + 10) {
    selectedYear = Math.round((mouseX - 50) / yearWidth + firstYear);
  }

  // Draw timeline
  for (var i = 0; i < years.length; i++) {
    fill(years[i] === selectedYear ? 0 : 255);
    rect(50 + yearWidth * i, mapHeight, yearWidth, yearHeight);
  }

  var stats = showPrimary ? 
                data[selectedYear].primary : 
                data[selectedYear].secondary;

  // Fill countries              
  for (country in stats.countries) {
    if (stats.countries.hasOwnProperty(country)) {
      var stat = stats.countries[country];
      if (stat !== -9) {
        amount = map(stat, stats.min, stats.max, 0, 1);
        fillCountry(country, lerpColor(lo, hi, amount));
      } else {
        fillCountry(country, "#E0E0E0");
      }
    }
  }

  // Update timeline label
  $("#year").css({
    position: "absolute",
    left: 53 + yearWidth * (selectedYear - firstYear),
    top: mapHeight - 12
  }).text(selectedYear);

  // Update category label
  $("#category").text(
    showPrimary ? 
      "Primary school enrollment (female)" : 
      "Secondary school enrollment (female)"
  );

}

function mouseClicked() { showPrimary = !showPrimary; }