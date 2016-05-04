// it's still a mess, but it's getting there. now showing all related entities
// on hover, also those that are not in the circels on the screen.
// clicking on each entitiy should show the relevant video bit.

var robotoFont;
var robotoFontBold;

var sMatrix;
entitiesMatrix = {};
entities = [];
numbersMatrix = [];
allEntities = [];
var dobj=[];
var bubble;

var svdResult;
var maxPairCount = 0;
var maxCount = 0;
var min_0_U;
var max_0_U;
var min_1_U;
var max_1_U;

var minDim;

var selected  = -1;
var offset = 0;
var numOfEntitiesToShow = 30;

var currVid;

var videoLink = "";

var loadLocal = true;
//hasSuperGlueData = false

var videosMode = true;
var showTitle = true;
var dateString;

var playing = false;
// plays or pauses the video depending on current state
function toggleVid() {
  if (playing) {
    currVid.pause();
    //currVid.hide()
  } else {
    //currVid.show()
    currVid.play();
  }
  playing = !playing;
}

function toggleVideosMode() {
  videosMode = !videosMode
}

function preload() {
  if (!loadLocal) {
    getSuperGlueData();
  } else {
    loadJSON('data/frequent_itemsets-29-4.json', superGlueloadCallback)
  }
  
  robotoFont = loadFont('assets/Roboto-Regular.ttf');
  robotoFontBold = loadFont('assets/Roboto-Bold.ttf');
}
var grid;
function setup() {
  createCanvas(windowWidth, windowHeight)
  minDim = min([width, height])
  calculateSVD()
  currVid = createVideo("")
  currVid.size(minDim/2, minDim/2)
  currVid.position(width/4-(currVid.width)/2, height/2-(currVid.height)/2)
  //clipString = 'rect('+width/2-width/6+'px,'+width/2+width/6+'px,'+height/2+'px,'+width/2-width/6+'px)'
  //currVid.style('clip:'+clipString+';')
  //currVid.style('border-radius:100%;')
  currVid.mousePressed(toggleVid)
  //currVid.style('opacity: 0.5;')
  
  dateString = getDateString()
  grid = new Grid(36, // px, top margin
    36, // px, bottom margin
    36, // px, left margin
    36, // px, right margin
    3, // # columns
    12, // px, gutter width
    12 // # rows
  );
}

function draw() {
  //background(150)
  //background('rgb(47, 55, 79)')
  //background('rgb(48, 52, 73)')
  //background('rgb(116, 120, 146)')
  background(255)
  if (showTitle){
    drawTitle()
  }
  push();
  fill(0)
  noStroke()
  textFont(robotoFont)
  textSize(15)
  textAlign(LEFT)
  text ("ENTER - toggle navigation / videos mode", 10, height-60)
  text ("SPACE - play / pause video", 10, height-40)
  pop();
  noFill();


  // Draw the entities
  var hover = false
  entities.forEach(function(entity, idx, array) {
    if (entity.containsCursor()) {
      hover = true
      if(selected==-1){
      entity.highlight()
      for (j = 0; j < entities.length; j++) {
        if (numbersMatrix[j][idx] > 0 || idx==j) {
          //stroke(map(numbersMatrix[j+offset][idx], 0, maxPairCount, 255, 0))
          //line(entity.x, entity.y, entities[j].x, entities[j].y)
          entities[j].highlight()
        }
        else {
          entities[j].unhighlight()
        }
      }
    }
    }
    entity.update();
    entity.display();
    entity.displayText();
  });
  if (!hover) {
    cursor(ARROW);
  entities.forEach(function(entity, idx, array) {
    entity.unhighlight()
  })
  }
  else {
    cursor(HAND);
  }
  //grid.display()
}

function drawTitle() {
  push()
    //fill(255)
    fill(0)
    noStroke()
    textAlign(LEFT, TOP)
    textSize(40)
    textFont (robotoFontBold)
    textStyle(BOLD)
    text("Top Entities in the News", 30, 30)
    textSize(25)
    textFont (robotoFont)
    text (dateString, 30, 90)
  pop()
}

function calculateSVD() {
  // create numbers matrix and temp sMatrix
  sMatrix = []
  for (i = 0; i < allEntities.length; i++){
    numbersMatrix[i] = []
    sMatrix[i] = []
  }
  for (j = 0; j < allEntities.length; j++) {
    for (i = 0; i < entities.length; i++) {
      pairKey = join(sort([entities[i].name, allEntities[j][0]]),',')
      val = pairKey in entitiesMatrix? entitiesMatrix[pairKey].count : 0;
      if (val>0) {
        entities[i].connections[allEntities[j][0]] = val
      }
      if (i == j) {
        val = 0
      }
      numbersMatrix[j].push(val)
      sMatrix[j].push(val> 0.001 ? 1 : 0)
    }
  }

  svdResult = numeric.svd(sMatrix);
  min_0_U = 100
  max_0_U = -100
  min_1_U = 100
  max_1_U = -100
  for (i = 0; i < numOfEntitiesToShow; i++){//svdResult.U.length; i++) {
    min_0_U = svdResult.U[i][0] < min_0_U ? svdResult.U[i][0] : min_0_U
    min_1_U = svdResult.U[i][1] < min_1_U ? svdResult.U[i][1] : min_1_U
    max_0_U = svdResult.U[i][0] > max_0_U ? svdResult.U[i][0] : max_0_U
    max_1_U = svdResult.U[i][1] > max_1_U ? svdResult.U[i][1] : max_1_U
  }
  print ( min_0_U+" "+min_1_U+" "+max_0_U+" "+max_1_U)
  
  var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(0);
  
  bubble_result = bubble.nodes({children:dobj.slice(offset, offset+numOfEntitiesToShow)})[0].children
  
  for (i = 0; i < entities.length; i++) {
    calculateXY(svdResult, i)
    // entities[i].x = i< offset || i>=offset+numOfEntitiesToShow? width*2 : bubble_result[i].x +width/4
    // entities[i].y = i< offset || i>=offset+numOfEntitiesToShow? height/2 :entities[i].y = bubble_result[i].y
    // entities[i].radius = i< offset || i>=offset+numOfEntitiesToShow? minDim/6 : bubble_result[i].r*1.8
  }
}

function calculateXY(svdResult, i) {
  border = 80
  if (i< offset || i>=offset+numOfEntitiesToShow) {
    mappedX = width*2
    mappedY = height/2
  }
  else {
  mappedX = map(svdResult.U[i][0], min_0_U, max_0_U, width/3, width - 2*border)
  mappedY = map(svdResult.U[i][1], min_1_U, max_1_U, border, height - 2*border)
  startTime = millis();
  colliding = true
  while (colliding && millis()-startTime<1000) {
    colliding = true
    for (j = 0; j < i; j++) {
      squaredDist = sq(mappedX - entities[j].x) + sq(mappedY - entities[j].y)
      squaredRadius = sq(entities[i].radius / 2 + entities[j].radius / 2)
      if (squaredDist <= squaredRadius) {
        colliding = true
        distToMove = sqrt(squaredRadius - squaredDist)
        mappedX = mappedX + distToMove < width - entities[i].radius  ? mappedX + distToMove : mappedX - distToMove > entities[i].radius  ? mappedX - distToMove : mappedX
        mappedY = mappedY + distToMove < height - entities[i].radius ? mappedY + distToMove : mappedY - distToMove > entities[i].radius  ? mappedY - distToMove : mappedY
        //mappedX = width-mappedX
        //mappedY = height-mappedY
        //print("colliding! " + entities[i].name + " " + entities[j].name)
        break
      }
    }
  }
  }
  entities[i].x = mappedX
  entities[i].y = mappedY
}

CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getSuperGlueData() {
  var url = 'http://super-glue.media.mit.edu/frequent_itemsets?with_replacement=true'
    //var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=40'
  loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback(data) {
  //print(data);
  results = data.results;
  //print (results)
  maxCount = results.scored_entities[offset][1]
  allEntities = results.scored_entities
  for (i = 0; i < allEntities.length ; i++) {
    entity = allEntities[i][0]
    // if (entity == "us" || entity == "us." || entity == "u.s." || entity == "reporter") {
    //   continue
    // }
    count = results.scored_entities[i][1]
    d = new Entity(entity, count);
    entities.push(d)
    
    dobj.push({"key": entity, "value":count})
  }
  entitiesMatrix = results.sets;
  for (pair in entitiesMatrix) {
    if (pair.count>maxPairCount) {
      maxPairCount = pair.count
    }
  }
}

function mouseClicked() {
  //showTitle=false
  if (videosMode) {
    if (selected!=-1) {
      //video relation: 16*9
      entities[selected].setTarget(width/4, height/2, minDim/2)
      entities.forEach(function(entity, idx, array) {
      if (entity.containsCursor()) {
        selectedPair= idx
        keyPair = sort([entities[selected].name, entity.name]).join(',')
        videoLink = entitiesMatrix[keyPair].matching_caps[0].link
        if (!(selected==idx && playing)) {
          currVid.src = videoLink
          currVid.play()
          playing = true
        }
        //return;
      }
    })
    entities[selected].isSelected = true
    return 
    }
  }
  var foundSelected = false
  entities.forEach(function(entity, idx, array) {
    if (entity.containsCursor()) {
      selected = idx
      foundSelected = true
      entity.setTarget(width/4, height/2, minDim/3)
      //return;
    }
  })
  if (foundSelected) {
    currSMatrix = {}
    indexs = []
    entities.forEach(function(entity, idx, array) {
      entity.isSelected = false
      if (numbersMatrix[idx][selected] > 0 && idx!=selected) {
        indexs.push(idx)
    }
    else {
      if (idx!=selected) {
        moveX = (entity.x-width/2)*40;
        moveY = (entity.y-height/2)*40;
        entity.setTarget (entity.x+moveX,entity.y+moveY, entity.origR);
      }
    }
    })
    arr = indexs
    indexInArr = function(index, array) { for (i=0; i<array.length; i++){ if (array[i]==index) return true;} return false;}
    currSMatrix = sMatrix.filter(function(value, index){return indexInArr(index, arr)}).map(function(value, index){return value.filter(function(value, index){return indexInArr(index, arr)})})

    currSvdResult = numeric.svd(currSMatrix);
    curr_min_0_U = 100
    curr_min_1_U = 100
    curr_max_0_U = -100
    curr_max_1_U = -100
    for (i = 0; i < currSvdResult.U.length; i++) {
    curr_min_0_U = currSvdResult .U[i][0] < curr_min_0_U ? currSvdResult .U[i][0] : curr_min_0_U
    curr_min_1_U = currSvdResult .U[i][1] < curr_min_1_U ? currSvdResult .U[i][1] : curr_min_1_U
    curr_max_0_U = currSvdResult .U[i][0] > curr_max_0_U ? currSvdResult .U[i][0] : curr_max_0_U
    curr_max_1_U = currSvdResult .U[i][1] > curr_max_1_U ? currSvdResult .U[i][1] : curr_max_1_U
    }
    for (i=0; i<indexs.length; i++) {
      mappedX = map(currSvdResult.U[i][0], curr_min_0_U, curr_max_0_U, width/3+80, width - 80)
      mappedY = map(currSvdResult.U[i][1], curr_min_1_U, curr_max_1_U, 80, height - 80)
      entities[indexs[i]].setTarget(mappedX, mappedY,entities[indexs[i]].origR)
    }
    
  }
  else {
    selected = -1
  }
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
    print (keyCode)
  if (keyCode === ENTER) {
    //print("space pressed")
    toggleVideosMode()
    if (playing) {
      toggleVid()
      currVid.src = ""
      currVid.hide()
    }
    else {
      currVid.show()
    }
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