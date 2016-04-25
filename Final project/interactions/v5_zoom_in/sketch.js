// it's still a mess, but it's getting there. now showing all related entities
// on hover, also those that are not in the circels on the screen.
// clicking on each entitiy should show the relevant video bit.


entitiesMatrix = {}
entities = []
numbersMatrix = []
allEntities = []

var svdResult
var maxPairCount = 0;
var maxCount = 0;
var min_0_U
var max_0_U
var min_1_U
var max_0_U

var selected  = -1

var offset = 0
var numOfEntitiesToShow = 30

var loadLocal = true
//hasSuperGlueData = false

function preload() {
  if (!loadLocal) {
    getSuperGlueData();
  } else {
    loadJSON('data/frequent_itemsets.json', superGlueloadCallback)
  }
}

function setup() {
  createCanvas(700,700)
  calculateSVD()
}

function draw() {
  background(150)
    //drawEntitiesMatrix()
    // stroke(1)
  noFill();


  // Draw the entities
  entities.forEach(function(entity, idx, array) {
    if (entity.containsCursor()) {
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
      // y = 100
      // push();
      // textSize(30)
      // for (connection in entity.connections){
      //   text (connection,20, y)
      //   y+=30
      // }
      // pop();
    }
    entity.update();
    entity.display();
    entity.displayText();
  });
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
  for (i = 0; i < entities.length; i++) {
    calculateXY(svdResult, i)
    // border = 40
    // mappedX = map(svdResult.U[i][0], min_0_U, max_0_U, border, width - border)
    // mappedY = map(svdResult.U[i][1], min_1_U, max_1_U, border, height - border)
    // entities[i].x = mappedX
    // entities[i].y = mappedY
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
  var url = 'http://super-glue.media.mit.edu/frequent_itemsets'
    //var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=40'
  loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback(data) {
  //print(data);
  results = data.results;
  print (results)
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
  }
  entitiesMatrix = results.sets;
  for (pair in entitiesMatrix) {
    if (pair.count>maxPairCount) {
      maxPairCount = pair.count
    }
  }
}

function mouseClicked() {
  var foundSelected = false
  entities.forEach(function(entity, idx, array) {
    entity.c = 0
    if (entity.containsCursor()) {
      selected = idx
      foundSelected = true
      entity.c = color('red')
      entity.setTarget(width/2, height/2, width/3)
      //return;
    }
  })
  if (foundSelected) {
    angle = 0
    angleMove = TWO_PI/(Object.keys(entities[selected].connections).length)
    startLocation = createVector(80, height/2).sub(createVector(width/2, height/2))
    entities.forEach(function(entity, idx, array) {
    if (numbersMatrix[idx+offset][selected] > 0 && idx!=selected) {
      entity.setTarget (width/2+startLocation.x, height/2+startLocation.y, 80)
      startLocation = startLocation.rotate(angleMove)
    }
    else {
      if (idx!=selected) {
        entity.setTarget (width+100, height/2, entity.radius)
      }
    }
    })
  }
  //selected = -1
}

function Entity(name, count) {
  this.name = name;
  this.count = count;
  this.x = 0;
  this.y = 0;
  
  this.connections = {};
  this.radius = map(this.count, 0, maxCount, width/4, width*2)
  this.connections = {}
  
  this.c = 0
  this.isAnimating = false
  this.targetX = 0;
  this.targetY = 0;
  this.targetSize = this.radius
  this.sizeStep = 0
  this.moveVector = createVector(0,0)
  
  this.steps = 40*1.0
  this.currStep  = 0
  
  
  this.setTarget = function(targetX, targetY, targetSize) {
    this.isAnimating = true
    this.currStep  = 0
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetSize = targetSize;
    this.moveVector = createVector(targetX, targetY).sub(createVector(this.x, this.y)).div(this.steps)
    this.sizeStep = (this.targetSize-this.radius)/this.steps
  }
  
  this.update = function() {
    if (this.isAnimating) {
      if (this.currStep>this.steps) {
        this.isAnimating = false
        return
      }
      newLocation = createVector(this.x, this.y).add(this.moveVector)
      this.x = newLocation.x
      this.y = newLocation.y
      this.radius+=this.sizeStep
      this.currStep++
    }
  }

  this.highlight = function() {
    //this.c = color('rgb(132, 245, 255)')
  }
  
  this.unhighlight = function() {
    this.c = 0
  }

  this.display = function() {
    push();
    fill(255);
    stroke(this.c);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.radius, this.radius);
    pop();
    //this.displayText()
  }
  this.displayText = function() {
    push();
    textAlign(CENTER, CENTER)
    noStroke();
    fill(this.c)
    text(trim(this.name).replace(/\s+/g, '\n').toLowerCase().capitalizeFirstLetter(), this.x, this.y);
    pop();

  }

  this.containsCursor = function() {
    return sq((mouseX - this.x) / this.radius) + sq((mouseY - this.y) / this.radius) < 0.25;
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}