// Show a grid of 12*6, color the grid square that shows the current time
function setup() {
  createCanvas(400, 400);
  //textAlign(CENTER, CENTER);
  
}


function draw() {
  background(255);
  stroke(0);
  var gridPadding = 20;
  gridWidth = width-(gridPadding*2)
  gridHeight = height-(gridPadding*2)
  // draw a frame for the grid
  rectMode(CENTER);
  fill (255);
  rect(width/2, height/2, gridWidth, gridHeight);
  // draw 6 horizontal lines
  fill (0);
  for (var i = 0; i < 12; i++) {
    var y = (i+1) * gridHeight/12 + gridPadding;
    line(gridPadding, y, width-gridPadding, y);
    text ((i+1)*5, 0, y);
  }
  // next draw 12 vertical lines
  for (var i = 0; i < 12; i++) {
    var x = (i+1) * gridWidth/12 + gridPadding;
    line(x, gridPadding, x, height-gridPadding);
    text (i, x-((gridWidth/12)/2),gridPadding/2 );
  }
  currHour = humanHour();
  currMinute = minute();
  currSecond = second();
  rectMode(CORNER);
  fill(100);
  
  rect (((gridWidth/12)*(currHour))+gridPadding, (gridHeight/60)*(Math.floor(currMinute/5))*5+gridPadding, 
          gridWidth/12, ((gridHeight/60)*(currMinute%5))+(gridHeight/(60*60))*currSecond)
  
//   noStroke();
//   fill(0);
//   // adds 1 to y so that it centers a little better
//   text(hoursMinutesSeconds(), width/2, height/2 + 1);
}


// return hours that read 1 through 12 rather than 0 through 23
function humanHour() {
  var h = hour() % 12;
  if (h == 0) {
    h = 12;
  }
  return h;
}


// format hours and minutes
function hoursMinutes() {
  return nf(humanHour(), 2) + ':' + nf(minute(), 2);
}


// format hours, minutes, and seconds
function hoursMinutesSeconds() {
  return hoursMinutes() + ':' + nf(second(), 2);
}

