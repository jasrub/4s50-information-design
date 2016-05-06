
// Reference to physics world
var physics;

// A list of cluster objects
var cluster;

// the video object
var currVid;

var robotoFont;
var robotoFontBold;

var sMatrix;
entitiesMatrix = {};
numbersMatrix = [];
allEntities = [];
var maxPairCount = 0;
var maxCount = 0;


var minDim;

var selected  = -1;
var offset = 0;
var numOfEntitiesToShow = 50;

var loadLocal = true;
//hasSuperGlueData = false

var videosMode = true;
var showTitle = true;
var dateString;
var bgColor;
var typesList = {};

function preload() {
  if (!loadLocal) {
    getSuperGlueData();
  } else {
    loadJSON('data/data_with_types.json', superGlueloadCallback)
  }
  
  robotoFont = loadFont('assets/Roboto-Regular.ttf');
  robotoFontBold = loadFont('assets/Roboto-Bold.ttf');
}
var grid;
function setup() {
  createCanvas(windowWidth, windowHeight)
  minDim = min([width, height])
  
  grid = new Grid(36, // px, top margin
    36, // px, bottom margin
    36, // px, left margin
    36, // px, right margin
    4, // # columns
    12, // px, gutter width
    12 // # rows
  );
  Node.setRadius();
  Node.getColorMap(typesList);
  // Initialize the physics
  physics=new VerletPhysics2D();

  
  
  currVid = new Video()
  
  createNumbersMatrix()
  cluster = new Cluster(8, 200, allEntities, numbersMatrix);

  dateString = getDateString()
  bgColor = color('rgb(21, 33, 64)')

}


function draw() {

  background(bgColor)
  drawTitle()

  // Update the physics world
  physics.update();
  
  cluster.showConnections();
  currVid.display();
  cluster.display();
}

function drawTitle() {
  if (showTitle){
    // draw caps around title square
  push();
  noFill()
  stroke(255)
  strokeWeight(3)
  rect (currVid.x-3, currVid.y-3, currVid.w+6, currVid.h+6)
  noStroke()
  fill(bgColor)
  rect (currVid.x-5, currVid.y+10, currVid.w+15, currVid.h-20)
  rect (currVid.x+10, currVid.y-5, currVid.w-20, currVid.h+15)
  pop();
  push()
    fill(255)
    noStroke()
    textAlign(CENTER)
    textSize(grid.rowheight()/2)
    textFont (robotoFontBold)
    textStyle(BOLD)
    text("Visualizing the News", currVid.x+currVid.w/2, currVid.y+grid.rowheight())
    textSize(grid.rowheight()/3)
    textFont (robotoFont)
    text (dateString,  currVid.x+currVid.w/2, currVid.y+grid.rowheight()*2)
  pop()

  }
}


function drawExplenations() {
  push()
    fill(255)
    noStroke()
    textAlign(LEFT)
    textSize(grid.rowheight()/3)
    textFont (robotoFont)
    string = "These are top moset mentioned entities in the news today.\n"+
    "Hover on the circles to highlight the connections\n"+
    "Click on a circle to show only the entities that relate to it.\n"
    "Click on a related entity to see the relevant video bit"
    text(string, currVid.x+currVid.w/2, currVid.y+grid.rowheight())
    textSize(grid.rowheight()/3)
    textFont (robotoFont)
    text (dateString,  currVid.x+currVid.w/2, currVid.y+grid.rowheight()*2)
  pop()
}


function getSuperGlueData() {
  var url = 'http://super-glue.media.mit.edu/frequent_itemsets?with_replacement=true'
  loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback(data) {
  results = data.results;
  maxCount = results.scored_entities[offset][1].score
  allEntities = results.scored_entities
  typesList = results.types

  entitiesMatrix = results.sets;
  // calcualte max pair count // needed??
  for (pair in entitiesMatrix) {
    if (pair.count>maxPairCount) {
      maxPairCount = pair.count
    }
  }
}

function createNumbersMatrix() {
  // create numbers matrix and temp sMatrix
  sMatrix = []
  for (i = 0; i < allEntities.length; i++){
    numbersMatrix[i] = []
    sMatrix[i] = []
  }
  for (j = 0; j < allEntities.length; j++) {
    for (i = 0; i < allEntities.length; i++) {
      pairKey = join(sort([allEntities[i][0], allEntities[j][0]]),',')
      val = pairKey in entitiesMatrix? entitiesMatrix[pairKey].count : 0;
      val = (i == j) ? 0: val
      numbersMatrix[j].push(val)
      sMatrix[j].push(val> 0.001 ? 1 : 0)
    }
  }
  // sMatrix = numbersMatrix.map(function(value, index){ return value.map(function(value, index){r = value> 0.001 ? 1 : 0; return r;})})
}


function mouseClicked() {
  //showTitle=false
  cluster.mouseClick(mouseX, mouseY);
  currVid.click();
}



function Button (string, x, y) {
  this.x = x
  this.y = y
  this.string = string
  this.font = robotoFont
  
  this.display = function() {
    push()
    textAlign(LEFT,TOP)
    fill(255)
    textFont(robotoFont)
    pop()
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

String.prototype.capitalizeFirstLetter = function() {
  if (this.length>4) {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  else {
    return this.toUpperCase()
  }
}

function getDateString() {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var d = new Date();
  return monthNames[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
}