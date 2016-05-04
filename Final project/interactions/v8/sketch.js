
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
var numOfEntitiesToShow = 30;

var loadLocal = true;
//hasSuperGlueData = false

var videosMode = true;
var showTitle = true;
var dateString;


// // plays or pauses the video depending on current state
// function toggleVid() {
//   if (playing) {
//     currVid.pause();
//     //currVid.hide()
//   } else {
//     //currVid.show()
//     currVid.play();
//   }
//   playing = !playing;
// }

function toggleVideosMode() {
  videosMode = !videosMode
  if (playing) {
      toggleVid()
      currVid.src = ""
      currVid.hide()
    }
  else {
      currVid.show()
  }
}

function preload() {
  if (!loadLocal) {
    getSuperGlueData();
  } else {
    loadJSON('data/data-01-05-doubles.json', superGlueloadCallback)
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
  // Initialize the physics
  physics=new VerletPhysics2D();
  // Set the world's bounding box
  //physics.setWorldBounds(new Rect(0,0,width,height));
  
  createNumbersMatrix()
  currVid = new Video()

  dateString = getDateString()

}

// function initializeVideo() {
//   currVid = createVideo("")
//   currVid.size(minDim/2, minDim/2)
//   currVid.position(width/4-(currVid.width)/2, height/2-(currVid.height)/2)
//   currVid.mousePressed(toggleVid)
// }

function draw() {
  
  //background(255)
  background('rgb(21, 33, 64)')
  drawTitle()
  displayToggles()
  
  // Update the physics world
  physics.update();
  //cluster.showConnections();
  cluster.display();
  
  currVid.drawRect();
  //grid.display()
}

function drawTitle() {
  if (showTitle){
  push()
    //fill(255)
    fill(255)
    noStroke()
    textAlign(LEFT, TOP)
    textSize(grid.rowheight()/2)
    textFont (robotoFontBold)
    textStyle(BOLD)
    text("Top Entities in the News", grid.margin.left,grid.margin.top,grid.colwidth())
    textSize(grid.rowheight()/3)
    textFont (robotoFont)
    text (dateString, grid.margin.left,grid.margin.top + grid.rowheight(),grid.colwidth())
  pop()
  }
}

function displayToggles() {
  push();
  fill(255)
  noStroke()
  textFont(robotoFont)
  textSize(15)
  textAlign(LEFT)
  text ("ENTER - toggle navigation / videos mode", 10, height-60)
  text ("SPACE - play / pause video", 10, height-40)
  pop();
  noFill();

}


function getSuperGlueData() {
  var url = 'http://super-glue.media.mit.edu/frequent_itemsets?with_replacement=true'
  loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback(data) {
  results = data.results;
  maxCount = results.scored_entities[offset][1]
  allEntities = results.scored_entities

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
  cluster = new Cluster(8, 200, allEntities, numbersMatrix);
  // sMatrix = numbersMatrix.map(function(value, index){ return value.map(function(value, index){r = value> 0.001 ? 1 : 0; return r;})})
}


function mouseClicked() {
  //showTitle=false
  cluster.mouseClick(mouseX, mouseY);
  
  // if (videosMode) {
  //   if (selected!=-1) {
  //     //video relation: 16*9
  //     entities[selected].setTarget(width/4, height/2, minDim/2)
  //     entities.forEach(function(entity, idx, array) {
  //     if (entity.containsCursor()) {
  //       selectedPair= idx
  //       keyPair = sort([entities[selected].name, entity.name]).join(',')
  //       videoLink = entitiesMatrix[keyPair].matching_caps[0].link
  //       if (!(selected==idx && playing)) {
  //         currVid.src = videoLink
  //         currVid.play()
  //         playing = true
  //       }
  //       //return;
  //     }
  //   })
  //   entities[selected].isSelected = true
  //   return 
  //   }
  // }
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
  //return this.charAt(0).toUpperCase() + this.slice(1);
  return this.toUpperCase()
}

function keyPressed() {
  if (keyCode === ENTER) {
    toggleVideosMode()
  }
  else if (keyCode == 32) {
    toggleVid()
  }
}

function getDateString() {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var d = new Date();
  return monthNames[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
}