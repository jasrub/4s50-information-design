var table;
var dictionary = {};
var sorted = [];

var barHt = 2;
var barSpacing = 1;
var numBars;
var maxBarWd = 200;

var sortingByNum = true;

function setup() {
  createCanvas(500, 700);
  
  numBars = 200;// (height-75)/(barHt+barSpacing);
  
  // pull data into a dictionary
  var rows = table.getRows();
  for (var i=0; i<rows.length; i++) {
    var primary = rows[i].getString(0);
    var secondary = rows[i].getString(1);
    primary = primary.split("/")[0];  // clean up names: get rid of everything after slash
    primary = primary.split("[")[0];
    secondary = secondary.split("/")[0];
    primary = titleCase(primary);
    secondary = titleCase(secondary);
    if (dictionary[primary] === undefined) {
      dictionary[primary] = [];
    }
    dictionary[primary].push(secondary);
  }
  
  // put the data into an array and sort it by number of partners (hi to lo)
  for (var key in dictionary) {
    sorted.push( { "character" : key, "collaborators" : dictionary[key] } );
  }
  sorted.sort( sortByNum );
  sorted = sorted.slice(0, numBars);  // cut down the list to the top 200 most social ones
}

function draw() {
  background(255);
  textSize(14);
  noStroke();
  rectMode(CORNERS);
  textAlign(CENTER);
  fill(0);
  text("The 200 Most \"Social\" Marvel Characters", width/2, 27);
  fill(100);
  var sortingScheme;
  if (!sortingByNum) sortingScheme = "number of co-appearances";
  else sortingScheme = "character name";
  text("Press any key to sort by " + sortingScheme, width/2, height-17);
  
  textAlign(LEFT);
  for (var i=0; i<numBars; i++) {
    var barWd = map( sorted[i].collaborators.length, 0, 9000, 0, maxBarWd );
    var yPos = 50 + i*(barHt+barSpacing);
    var hovered = false;
    if (mouseY>=yPos && mouseY<=yPos+barHt+barSpacing*.5) {
      hovered = true;
    }
    if (hovered) {
      fill(220, 20, 20);      
    } else {
      fill(200);
    }
    rect(maxBarWd, yPos, maxBarWd-barWd, yPos+barHt);
    if (hovered) {
      fill(0);
      text(sorted[i].character + "\n" + nfc(sorted[i].collaborators.length) + " contacts with another character", maxBarWd+10, yPos+7);
    }
  }
}


function preload() {
  table = loadTable("hero-network.csv", "csv"); 
}


function keyPressed() {
  sortingByNum = !sortingByNum;
  if (sortingByNum) sorted.sort(sortByNum);
  else sorted.sort(sortByAlpha);
}


function sortByNum(a, b) {
  return b.collaborators.length - a.collaborators.length;
}


function sortByAlpha(a, b) {
  var textA = a.character.toUpperCase();
  var textB = b.character.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}


function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    if (txt === "III" || txt === "II") return txt;
    else return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}