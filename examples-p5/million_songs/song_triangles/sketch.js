var table;
var rowNum = 0;
var numOfRows;  // set after load table
var lit = 0;
var lastLit = 0;
var litTime;
var never, mac, stepper, atari;
var song;
var songList = [ "never.wav", "mac.wav", "stepper.wav", "atari.wav" ];

function setup() {
  createCanvas(400, 400);
  numOfRows = table.getRowCount();
  song.loop();
}

function draw() {
  // preparing to draw   *   *   *   *   *
  
  // get data about the current song
  var row = table.getRow(rowNum);
  var dur = row.getNum("duration");
  var fadeIn = row.getNum("end_of_fade_in");
  var fadeOut = row.getNum("start_of_fade_out");
  var tempo = row.getNum("tempo");
  var loud = row.getNum("loudness");
  var artist = row.getString("artist_name");
  var title = row.getString("title");
  
  // calculate length of dots beat by tempo
  litTime = 1000.0 / (tempo / 60.0);
  
  // set size parameters for the triangle and dots
  var minWd = 250;
  var maxWd = 330;
  var minHt = 100;
  var maxHt = 260;
  
  var wd = map(dur, 200, 255, minWd, maxWd);
  var ht = map(loud, -10, -3, minHt, maxHt);
  // var inPct = fadeIn / dur;
  // var outPct = fadeOut / dur;
  // var midPt = wd / 2.0 + ( (inPct - outPct) * 50 );
  var fadeOutTime = 0.01;
  if (dur > fadeOut) {    // prevent div by 0
    fadeOutTime = dur-fadeOut;
  }
  var midPt = min(map(fadeIn - fadeOutTime, -13, 20, 20, wd-20), wd);
  
  var x0 = (width - wd) / 2.0;
  var y0 = height - 100
  var x1 = x0+wd;
  var y1 = y0;
  var x2 = x0 + midPt;
  var y2 = y0 - ht;
  var coords = [ x0, y0, x1, y1, x2, y2 ];    // array makes it easier to iterate when blinking the dots, but can still reference them by x0, y0, etc. as needed
  
  var circleDim = 30;  // size of each circle
  
  // color pal
  var hoverColor = color(20, 80, 220);
  var beatColor = color(220, 40, 24);
  var baselineColor = color(80);

  // check hover state
  var hoverState = "none";
  if ( dist(mouseX, mouseY, x2, y2) < circleDim ) {
    hoverState = "top";
  } 
  if ( dist(mouseX, mouseY, x0, y0) < circleDim || dist(mouseX, mouseY, x1, y1) < circleDim ) {
    hoverState = "bottom";
  }
  
  // actual drawing of stuff   *   *   *   *   *
  
  background(255);  // clear the background
  
  // draw triangle
  noFill();
  if (hoverState === "bottom") {
    stroke(hoverColor);
  } else {
    stroke(baselineColor);  
  }
  strokeWeight(1);
  triangle(x0, y0, x1, y1, x2, y2);
  
  // draw circles
  noStroke();
  for (var i=0; i<3; i++) {
    if (i === lit) {
      fill(beatColor);
    } else {
      fill(baselineColor);
    }
    if (hoverState === "top" && i===2) {
      fill(hoverColor);
    }
    if (hoverState === "bottom" && (i==0 || i==1)) {
      fill(hoverColor);
    }
    ellipse(coords[i*2], coords[i*2+1], circleDim, circleDim);
  }
  
  // cycle through lit dots by tempo
  if (lastLit + litTime < millis()) {
    lit--;
    if (lit < 0) {
      lit = 2;
    }
    lastLit = millis();
  }
  
  // artist name and title
  textSize(12);
  fill(0);
  textAlign(CENTER);
  text(artist, width/2, height - 43);
  text(title, width/2, height - 25);
  
  // hover info
  if (hoverState === "top") {
    fill(hoverColor);
    if (x2 < width/2.0) {
      textAlign(LEFT);
      text("peak volume " + loud + "db", x2+23, y2+2);      
    } else {
      textAlign(RIGHT);
      text("peak volume " + loud + "db", x2-23, y2+2);      
    }
    stroke(hoverColor);
    strokeWeight(0.5);
    line(x2, y2, x2, y0);
  } else if (hoverState === "bottom") {
    fill(hoverColor);
    textAlign(RIGHT);
    text("fade in\n" + nfc(fadeIn, 2), (x0+x2)/2.0 - 15, (y0+y2)/2.0);
    textAlign(LEFT);
    text("fade out\n" + nfc(dur-fadeOut, 2), (x1+x2)/2.0 + 15, (y0+y2)/2.0);
    textAlign(CENTER);
    text("duration " + round(dur) + " sec", width/2.0, height - 80);
  }
  
  // press any key...
  noStroke();
  fill(baselineColor);
  textAlign(RIGHT);
  text("press any key to cycle songs", width - 20, 20);
  
}

function keyPressed() {
  song.stop();
  song = null;
  
  rowNum++;
  if (rowNum >= numOfRows) {
    rowNum = 0;
  }
  
  song = loadSound(songList[rowNum], playSong);
}

function playSong() {
  song.loop();
}

function preload() {
  table = loadTable("data.csv", "csv", "header"); 
  song = loadSound("never.wav");
}