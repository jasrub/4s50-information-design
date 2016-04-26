// it's still a mess, but it's getting there. now showing all related entities
// on hover, also those that are not in the circels on the screen.
// clicking on each entitiy should show the relevant video bit.


entitiesMatrix = {}
entities = []
numbersMatrix = []
allEntities = []
var dobj=[]
var bubble

var svdResult
var maxPairCount = 0;
var maxCount = 0;
var min_0_U
var max_0_U
var min_1_U
var max_1_U

var minDim

var selected  = -1

var offset = 0
var numOfEntitiesToShow = 30

var currVid

var videoLink = ""

var loadLocal = true
//hasSuperGlueData = false

var videosMode = true
var showTitle = true
var dateString;

var playing = false
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
    loadJSON('data/frequent_itemsets_300_3_days_replacement.json', superGlueloadCallback)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  minDim = min([width, height])
  calculateSVD()
  currVid = createVideo("")
  currVid.size(minDim/2, minDim/2)
  currVid.position(width/2-(currVid.width)/2, height/2-(currVid.height)/2)
  //clipString = 'rect('+width/2-width/6+'px,'+width/2+width/6+'px,'+height/2+'px,'+width/2-width/6+'px)'
  //currVid.style('clip:'+clipString+';')
  currVid.style('border-radius:100%;')
  currVid.mousePressed(toggleVid)
  //currVid.style('opacity: 0.5;')
  
  dateString = getDateString()
}

function draw() {
  //background(150)
  //background('rgb(47, 55, 79)')
  //background('rgb(48, 52, 73)')
  background('rgb(116, 120, 146)')
    //drawEntitiesMatrix()
    // stroke(1)
  if (showTitle){
    push()
    fill(255)
    noStroke()
    textAlign(CENTER)
    textSize(50)
    textFont ("futura")
    text("Top Entities in the News", width/2, 70)
    textSize(30)
    text (dateString, width/2, 110)
    pop()
  }
  push();
  fill(0)
  noStroke()
  textFont('halvetica')
  textSize(15)
  textAlign(LEFT)
  text ("ENTER - toggle navigation / videos mode", 10, 40)
  text ("SPACE - play / pause video", 10, 60)
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
        if (numbersMatrix[j+offset][idx] > 0 || idx==j) {
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
      if (i+offset == j) {
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
  for (i = 0; i < svdResult.U.length; i++) {
    min_0_U = svdResult.U[i][0] < min_0_U ? svdResult.U[i][0] : min_0_U
    min_1_U = svdResult.U[i][1] < min_1_U ? svdResult.U[i][1] : min_1_U
    max_0_U = svdResult.U[i][0] > max_0_U ? svdResult.U[i][0] : max_0_U
    max_1_U = svdResult.U[i][1] > max_1_U ? svdResult.U[i][1] : max_1_U
  }
  print ( min_0_U+" "+min_1_U+" "+max_0_U+" "+max_1_U)
  
  var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height-40])
    .padding(0);
  
  bubble_result = bubble.nodes({children:dobj.slice(offset, offset+numOfEntitiesToShow)})[0].children
  
  for (i = 0; i < entities.length; i++) {
    //calculateXY(svdResult, i)
    entities[i].x = i< offset || i>=offset+numOfEntitiesToShow? width*2 : bubble_result[i].x
    entities[i].y = i< offset || i>=offset+numOfEntitiesToShow? height/2 :entities[i].y = bubble_result[i].y +80
    entities[i].radius = i< offset || i>=offset+numOfEntitiesToShow? minDim/6 : bubble_result[i].r*1.8
  }
}

function calculateXY(svdResult, i) {
  border = 80
  if (i< offset || i>=offset+numOfEntitiesToShow) {
    mappedX = width*2
    mappedY = height/2
  }
  else {
  mappedX = map(svdResult.U[i][0], min_0_U, max_0_U, border, width - border)
  mappedY = map(svdResult.U[i][1], min_1_U, max_1_U, border, height - border)
  startTime = millis();
  colliding = true
  while (colliding && millis()-startTime<1000) {
    colliding = false
    for (j = 0; j < i; j++) {
      squaredDist = sq(mappedX - entities[j].x) + sq(mappedY - entities[j].y)
      squaredRadius = sq(entities[i].radius / 2 + entities[j].radius / 2)
      if (squaredDist <= squaredRadius) {
        colliding = true
        distToMove = sqrt(squaredRadius - squaredDist)
        mappedX = mappedX + distToMove < width - entities[i].radius  ? mappedX + distToMove : mappedX - distToMove > entities[i].radius  ? mappedX - distToMove : mappedX
        mappedY = mappedY + distToMove < height - entities[i].radius ? mappedY + distToMove : mappedY - distToMove > entities[i].radius  ? mappedY - distToMove : mappedY
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
  //for (i = offset; i < offset+numOfEntitiesToShow; i++) {
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
  showTitle=false
  if (videosMode) {
    if (selected!=-1) {
      entities[selected].setTarget(width/2, height/2, minDim/2)
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
      entity.setTarget(width/2, height/2, minDim/3)
      //return;
    }
  })
  if (foundSelected) {
    angle = 0
    angleMove = TWO_PI/(Object.keys(entities[selected].connections).length-1)
    startLocation = createVector(width/2-minDim/2+80, height/2).sub(createVector(width/2, height/2))
    entities.forEach(function(entity, idx, array) {
      entity.isSelected = false
    if (numbersMatrix[idx+offset][selected] > 0 && idx!=selected) {
      entity.setTarget (width/2+startLocation.x, height/2+startLocation.y, minDim/10)
      startLocation = startLocation.rotate(angleMove)
    }
    else {
      if (idx!=selected) {
        //moveVector = createVector(entity.x, entity.y).sub(createVector(width/2, height/2))
        moveX = (entity.x-width/2)*15;
        moveY = (entity.y-height/2)*15;
        entity.setTarget (entity.x+moveX,entity.y+moveY, entity.radius);
      }
    }
    })
  }
  else {
    selected = -1
  }
}

function Entity(name, count) {
  this.name = name;
  this.count = count;
  this.x = 0;
  this.y = 0;
  
  this.connections = {};
  this.radius = map(this.count, 0, maxCount, width/2, width*2)
  this.connections = {}
  
  this.c = 0
  this.isAnimating = false
  this.targetX = 0;
  this.targetY = 0;
  this.sourceX = this.x
  this.sourceY = this.y
  this.targetSize = this.radius
  this.sizeStep = 0
  this.moveVector = createVector(0,0)
  
  this.steps = 60*1.0
  this.currStep  = 0
  this.percent  = 0
  
  
  this.setTarget = function(targetX, targetY, targetSize) {
    this.isAnimating = true
    this.currStep  = 0
    this.percent  = 0
    this.sourceX = this.x
    this.sourceY = this.y
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetSize = targetSize;
    this.moveVector = createVector(targetX, targetY).sub(createVector(this.x, this.y)).div(this.steps)
    this.sizeStep = (this.targetSize-this.radius)/this.steps
  }
  
  this.update = function() {
    if (this.isAnimating) {
      if (this.currStep>this.steps) {
        // this.x = this.targetX
        // this.y = this.targetY
        this.isAnimating = false
        return
      }

      var p = this.percent;
      p=(sqrt(p)+ p*p)/2;

      newLocation = p5.Vector.lerp(createVector(this.sourceX, this.sourceY), createVector(this.targetX, this.targetY), p);
      this.x = newLocation.x
      this.y = newLocation.y
      this.radius+=this.sizeStep
      this.currStep++
      this.percent = this.currStep/this.steps
    }
  }

  this.highlight = function() {
    this.c = color('rgb(182, 197, 201)')
  }
  
  this.unhighlight = function() {
    this.c = 0
  }

  this.display = function() {
    push();
    fill(this.c)
    noStroke()
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.radius, this.radius);
    pop();
    this.displayText()
  }
  this.displayText = function() {
    push();
    textAlign(CENTER, CENTER)
    //textStyle(BOLD)
    noStroke();
    fill(255)
    text(trim(this.name.split(' ').join('\n').capitalizeFirstLetter()), this.x, this.y)
    //text(trim(this.name).replace(/\s+/g, '\n').toLowerCase().capitalizeFirstLetter(), this.x, this.y);
    pop();

  }

  this.containsCursor = function() {
    return sq((mouseX - this.x) / this.radius) + sq((mouseY - this.y) / this.radius) < 0.25;
  }
}

function Button (string, x, y) {
  this.x = x
  this.y = y
  this.string = string
  this.font = 'halvetica'
  
  this.display = function() {
    push()
    textAlign(LEFT,TOP)
    fill(255)
    textFont()
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