//get word count
//http://super-glue.media.mit.edu/word_count?limit=30&offset=30 
// get media (top 10 by upload date)
//http://super-glue.media.mit.edu/media
//http://super-glue.media.mit.edu/media?limit=30&keywords=fbi
//http://super-glue.media.mit.edu/get_trends_entities


entitiesMatrix = {}
entities = []
numbersMatrix = []
allEntities = []

var svdResult
var maxPairCount = 0;
var maxCount = 0;
var pixelSize
var curr_i
var curr_j
var min_0_U
var max_0_U
var min_1_U
var max_0_U

var loadLocal = true
hasSuperGlueData = false

function preload() {
  if (!loadLocal) {
    getSuperGlueData();
  } else {
    loadJSON('data/frequent_itemsets.json', superGlueloadCallback)
  }
}

function setup() {
  createCanvas(2400,1200)
  calculateSVD()
}


function draw() {
  background(100)
    //drawEntitiesMatrix()
    // stroke(1)
  noFill();
  for (i=0; i<entities.length; i++) {
    push();
    stroke(255)
    noFill();
    start = i
    if (entities[i].containsCursor()) {
      stroke(color('red'));
      start = 0
    }
    for (j = start; j < entities.length; j++) {
        if (numbersMatrix[i][j] > 0) {
          //stroke(map(numbersMatrix[i][j], 0, maxPairCount, 255, 0))
          line(entities[i].x, entities[i].y, entities[j].x, entities[j].y)
        }
    }
    pop();
  }

  // Draw the entities
  entities.forEach(function(entity, idx, array) {
    // if (entity.containsCursor()) {
    //   for (j = 0; j < entities.length; j++) {
    //     if (numbersMatrix[idx][j] > 0) {
    //       stroke(map(numbersMatrix[idx][j], 0, maxPairCount, 255, 0))
    //       line(entity.x, entity.y, entities[j].x, entities[j].y)
    //     }
    //   }
    // }
    entity.display();
    entity.displayText();
  });
}


function calculateSVD() {
  // create numbers matrix and temp sMatrix
  sMatrix = []
  for (i = 0; i < entities.length; i++) {
    numbersMatrix[i] = []
    sMatrix[i] = []
    for (j = 0; j < entities.length; j++) {
      pairKey = join(sort([entities[i].name, entities[j].name]),',')
      val = pairKey in entitiesMatrix? entitiesMatrix[pairKey].count : 0;
      if (i == j) {
        val = 0
      }
      numbersMatrix[i].push(val)
      sMatrix[i].push(val> 0.001 ? 1 : 0)
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
  offset = 0
  num_of_entities = 30
  maxCount = results.scored_entities[offset][1]
  allEntities = results.scored_entities
  print (maxCount)
  for (i = offset; i < offset+num_of_entities; i++) {
    entity = results.scored_entities[i][0]
    if (entity == "us" || entity == "us." || entity == "u.s." || entity == "reporter") {
      continue
    }
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


function Entity(name, count) {
  this.name = name;
  this.count = count;
  this.x = 0;
  this.y = 0;
  this.connections = {};
  this.radius = map(this.count, 0, maxCount, 60, 180)

  this.display = function() {
    push();
    fill(255);
    stroke(0);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.radius, this.radius);
    pop();
  }
  this.displayText = function() {
    push();
    textAlign(CENTER, CENTER)
    noStroke();
    fill(0)
    text(trim(this.name).replace(/\s+/g, '\n').toLowerCase().capitalizeFirstLetter(), this.x, this.y);
    pop();

  }

  this.containsCursor = function() {
    return sq((mouseX - this.x) / this.radius) + sq((mouseY - this.y) / this.radius) < 0.25;
  }
}


function showWordFrequency() {
  y = 70;
  //print (frequencyData)
  for (i = 0; i < frequencyData.length; i++) {
    size = map(Math.log(frequencyData[i].count), 0, Math.log(frequencyData[0].count), 8, 30)
    textSize(size)
    text(frequencyData[i]._id, 50, y);
    y += size
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}