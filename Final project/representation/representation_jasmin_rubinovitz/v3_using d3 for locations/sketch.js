// trying d3.js algorithm for circle packing locations


entitiesMatrix = {}
entities = []
numbersMatrix = []
var dobj=[]

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

diameter = 700
var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter]);
    //.padding(0.5);
    

function setup() {
  createCanvas(diameter, diameter)
  calculateSVD()
}


function draw() {
  background(100)
    //drawEntitiesMatrix()
    // stroke(1)


  // Draw the entities
  entities.forEach(function(entity, idx, array) {
    if (entity.containsCursor()) {
      for (j = 0; j < entities.length; j++) {
        if (numbersMatrix[idx][j] > 0) {
          stroke(map(numbersMatrix[idx][j], 0, maxPairCount, 255, 0))
          line(entity.x, entity.y, entities[j].x, entities[j].y)
        }
      }
    }
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
  bubble_result = bubble.nodes({children:dobj})[0].children
  for (i = 0; i < entities.length; i++) {
    //calculateXY(svdResult, i)
    entities[i].x = bubble_result[i].x
    entities[i].y = bubble_result[i].y
    entities[i].radius = bubble_result[i].r
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
  offset = 10
  num_of_entities = 30
  maxCount = results.scored_entities[offset][1]
  print (maxCount)
  for (i = offset; i < offset+num_of_entities; i++) {
    entity = results.scored_entities[i][0]
    print (entity)
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

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}