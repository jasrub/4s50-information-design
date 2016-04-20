//get word count
//http://super-glue.media.mit.edu/word_count?limit=30&offset=30 
// get media (top 10 by upload date)
//http://super-glue.media.mit.edu/media
//http://super-glue.media.mit.edu/media?limit=30&keywords=fbi
//http://super-glue.media.mit.edu/get_trends_entities

var apiKey = "9a6a0874e114aa29583efd6775934125134e1c84115bfbed854673b34172b134"

trendsData = {}
entitiesMatrix = {}
entities = []
squaresMatrix = []
numbersMatrix = []

var svdResult
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
    getTrendingEntities();
  } else {
    loadJSON('18-4-data/entities_matrix_aligned_30_no_us.json', function tempCallback(data) {
      //print (data)
      entitiesMatrix = data;
    });
    loadJSON('18-4-data/trendsData_aligned_30_no_us.json', function tempCallback(data) {
      //print (data)
      trendsData = data;
      maxCount = 1
      for (entity in trendsData) {
        if (entity == "US" || entity == "US." || entity == "U.S." || entity == "Reporter") {
          continue
        }
        d = new Entity(entity, trendsData[entity].count);
        entities.push(d)
      }
    });
  }
}

function setup() {
  createCanvas(1700, 1200)
    //print (trendsData)
  print(entities)
    //print (entitiesMatrix)
  print(maxCount)
  if (maxCount == 0) {
    maxCount = 30;
  }
  //generateSquareMatrix()
  //print (entitiesMatrix)
  if (!loadLocal) {
    saveJSONObject(trendsData, 'trendsData_try3.json');
  }
  calculateSVD()
}


function draw() {
  background(100)
    //drawEntitiesMatrix()
    // stroke(1)
  noFill();

  // Draw the entities
  entities.forEach(function(entity, idx, array) {
    if (entity.containsCursor()) {
      for (j = 0; j < entities.length; j++) {
        if (numbersMatrix[idx][j] > 0) {
          stroke(map(numbersMatrix[idx][j], 0, 10, 255, 0))
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
      val = entitiesMatrix[entities[i].name][entities[j].name];
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
  }
}

function calculateXY(svdResult, i) {
  border = 40
  mappedX = map(svdResult.U[i][0], min_0_U, max_0_U, border, width - border)
  mappedY = map(svdResult.U[i][1], min_1_U, max_1_U, border, height - border)
  colliding = true
  while (colliding) {
    colliding = false
    for (j = 0; j < i; j++) {
      squaredDist = sq(mappedX - entities[j].x) + sq(mappedY - entities[j].y)
      squaredRadius = sq(entities[i].radius / 2 + entities[j].radius / 2)
      if (squaredDist <= squaredRadius) {
        colliding = true
        distToMove = sqrt(squaredRadius - squaredDist)
        mappedX = mappedX + distToMove < width - entities[i].radius / 2 ? mappedX + distToMove : mappedX - distToMove > entities[i].radius / 2 ? mappedX - distToMove : mappedX
        mappedY = mappedY + distToMove < height - entities[i].radius / 2 ? mappedY + distToMove : mappedY - distToMove > entities[i].radius / 2 ? mappedY - distToMove : mappedY
        print("colliding! " + entities[i].name + " " + entities[j].name)
        break
      }
    }
  }
  entities[i].x = mappedX
  entities[i].y = mappedY
}

CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getTrendingEntities() {
  var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=30&aligned='
    //var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=40'
  loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback(data) {
  print(data);
  results = data.results;
  for (i = 0; i < results.length; i++) {
    entity = results[i]["_id"]
    if (entity == "US" || entity == "US." || entity == "U.S." || entity == "Reporter") {
      continue
    }
    trendsData[entity] = {}
    trendsData[entity].count = results[i]["count"]
    d = new Entity(entity, trendsData[entity].count);
    entities.push(d)
      //getWordCountData(entity)
  }
  for (i = 0; i < entities.length; i++) {
    var entity_1 = entities[i].name
    entitiesMatrix[entity_1] = {};
    //print(i+" " +entitiesMatrix)
    //var entity_1 = entities[i]
    for (j = i; j < entities.length; j++) {
      var entity_2 = entities[j].name
      var url = 'http://super-glue.media.mit.edu/sentence_count?entity_1=' + entity_1 + '&entity_2=' + entity_2 + '&aligned='
      print(encodeURI(url))
      loadJSON(encodeURI(url), function(data) {
        sentence_count_result = data.results;
        args = data.args
        count = sentence_count_result["count"];
        print(args.entity_1 + " " + args.entity_2 + " " + count)
        entitiesMatrix[args.entity_1][args.entity_2] = count
        entitiesMatrix[args.entity_2][args.entity_1] = count
        if (args.entity_1 != args.entity_2 && count > maxCount) {
          maxCount = count
        }
      });
    }
  }
}

function getWordCountData(query) {
  if (apiKey) {
    var end_date = new Date().toISOString();
    var start_date = incrementDate(Date.now(), -2).toISOString();
    var date_string = '[' + start_date + ' TO ' + end_date + ']'
      //var query = input.value()
    var url = CORS_PROXY + 'https://api.mediacloud.org/api/v2/wc/list?include_stats=1&key=' + apiKey + '&q=sentence:' + query + '&fq=tags_id_media:8875027&fq=publish_date:' + date_string;
    print(encodeURI(url))
    loadJSON(encodeURI(url), function loadCallbackWordCount(data) {
      print(query);
      print(data.words.slice(0, 40));
      trendsData[query].frequency = data.words.slice(0, 40);
      trendsData[query].stats = data.stats;
    });
  }
}

var incrementDate = function(date, amount) {
  var tmpDate = new Date(date);
  tmpDate.setDate(tmpDate.getDate() + amount)
  return tmpDate;
};

function Entity(name, count) {
  this.name = name;
  this.count = count;
  this.x = 0;
  this.y = 0;
  this.connections = {};
  this.radius = map(this.count, 0, 50, 60, 120)

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