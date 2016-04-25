// The matrix represents the connections between the top entities in the news

var apiKey = "9a6a0874e114aa29583efd6775934125134e1c84115bfbed854673b34172b134"

trendsData = {}
entitiesMatrix={}
entities = []
squaresMatrix = []
var maxCount = 0;
var pixelSize
var curr_i
var curr_j

var loadLocal = true
hasSuperGlueData = false
function preload() {
  if (!loadLocal) {
    getTrendingEntities();
  }
  else {
    loadJSON('18-4-data/entities_matrix.json', function tempCallback(data) {
    //print (data)
    entitiesMatrix = data;
    });
    loadJSON('18-4-data/trendsData.json', function tempCallback(data) {
    //print (data)
    trendsData = data;
    maxCount=1
    for (trend in trendsData) {
      entities.push(trend)
    }
    });
  }
}

function setup() {
  createCanvas(1000,1000)
  print (trendsData)
  print (entities)
  print (entitiesMatrix)
  print (maxCount)
  if (maxCount==0) {
    maxCount=30;
  }
  generateSquareMatrix()
  //print (entitiesMatrix)
  if (!loadLocal) {
    saveJSONObject(trendsData, 'trendsData_try3.json');
  }
  frameRate(30)
}


function draw() {
  background(255)
  drawEntitiesMatrix()
 // stroke(1)
  for (i=0; i<squaresMatrix.length; i++) {
    for (j=0; j<squaresMatrix[i].length; j++) {
      squaresMatrix[i][j].display();
      //rect (squaresMatrix[i][j].x, squaresMatrix[i][j].y, pixelSize, pixelSize)
    }
  }
}
function generateSquareMatrix() {
  matSize = 700;
  pixelSize  = matSize/entities.length
  for (i=0; i<entities.length; i++) {
    squaresMatrix[i] = []
    for (j=i; j<entities.length; j++) {
      rectColor = 255
      val = entitiesMatrix[entities[i]][entities[j]]
      if (val>0){
        rectColor = map(val, 1,250,160,0)
      }
      squaresMatrix[i].push(new Square(i, j, pixelSize, pixelSize, rectColor, CORNER));
    }
  }
}
function drawEntitiesMatrix() {
  matSize = 700;
  pixelSize  = matSize/entities.length
  noStroke()
  for (i=0; i<entities.length; i++) {
  fill(i==curr_j ? color('red'):0)
  textAlign(LEFT,CENTER)
  text (entities[i], i*pixelSize+30, i*pixelSize+pixelSize/2)
  push();
  translate(i*pixelSize+pixelSize/2, 705)
  rotate(radians(90))
  fill(i==curr_i ? color('red'):0)
  text (entities[i], 0, 0)
  fill(0)
  pop();
  }
}
CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getTrendingEntities() {
    var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=50'
    //var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=40'
    loadJSON(encodeURI(url), superGlueloadCallback);
}

function superGlueloadCallback (data) {
  print (data);
  results = data.results;
  for (i=0; i<results.length; i++) {
    entity = results[i]["_id"]
    trendsData[entity] = {}
    trendsData[entity].count = results[i]["count"]
    entities.push(entity)
    //getWordCountData(entity)
  }
  for (i=0; i<entities.length; i++) {
    var entity_1 = entities[i]
    entitiesMatrix[entity_1] = {};
    //print(i+" " +entitiesMatrix)
    //var entity_1 = entities[i]
    for (j=i; j<entities.length; j++){
      var entity_2 = entities[j]
      var url = 'http://super-glue.media.mit.edu/sentence_count?entity_1='+entity_1+'&entity_2='+entity_2
      print (encodeURI(url))
      loadJSON(encodeURI(url), function(data){
        sentence_count_result = data.results;
        args = data.args
        count = sentence_count_result["count"];
        print (args.entity_1+" "+args.entity_2+" "+count)
        entitiesMatrix[args.entity_1][args.entity_2] = count
        entitiesMatrix[args.entity_2][args.entity_1] = count
        if (args.entity_1!=args.entity_2 && count>maxCount) {
          maxCount=count
        }
      });
    }
  }
}

function getWordCountData(query) {
  if (apiKey) {
    var end_date = new Date().toISOString();
    var start_date = incrementDate(Date.now(), -2).toISOString();
    var date_string = '['+start_date+ ' TO '+end_date+']'
    //var query = input.value()
    var url = CORS_PROXY+'https://api.mediacloud.org/api/v2/wc/list?include_stats=1&key='
            + apiKey + '&q=sentence:'+query+'&fq=tags_id_media:8875027&fq=publish_date:'+date_string;
    print (encodeURI(url))
    loadJSON(encodeURI(url), function loadCallbackWordCount(data) {
        print (query);
        print (data.words.slice(0,40));
        trendsData[query].frequency = data.words.slice(0,40);
        trendsData[query].stats = data.stats;
    });
  }
}

var incrementDate = function (date, amount) {
    var tmpDate = new Date(date);
    tmpDate.setDate(tmpDate.getDate() + amount)
    return tmpDate;
};

function Square(x, y, w, h, c, mode) {
  if (!mode) {
    mode = CORNER;
  }

  this.x = x*pixelSize;
  this.y = y*pixelSize;
  this.i = x;
  this.j = y;
  this.w = w;
  this.h = h;
  this.c = c;
  this.mode = mode;

  this.display = function() {
    //push();
    fill(this.c);
    if (curr_i==this.i && curr_j==this.j) {
      fill(color('red'))
    }
    //stroke(0);
    //rectMode(this.mode);
    rect(this.x, this.y, this.w, this.h);
    //pop();
  }

  this.containsCursor = function() {
    /* This function can handle all the different modes of drawing
     * rects. See http://p5js.org/reference/#p5/rectMode
     */
    switch (this.mode) {
      case CORNER:
        return (mouseX > this.x && mouseX < this.x + this.w) &&
          (mouseY > this.y && mouseY < this.y + this.h);
      case CORNERS:
        return (mouseX > this.x && mouseX < this.w) &&
          (mouseY > this.y && mouseY < this.h);
      case CENTER:
        return (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2) &&
          (mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2);
      case RADIUS:
        return (mouseX > this.x - this.w && mouseX < this.x + this.w) &&
          (mouseY > this.y - this.h && mouseY < this.y + this.h);
      default:
        return false;
    }
  }
}

function mouseMoved() {
  curr_i = Math.floor(mouseX/pixelSize)
  curr_j = Math.floor(mouseY/pixelSize)
}
function showWordFrequency() {
  y=70;
  //print (frequencyData)
  for (i=0; i<frequencyData.length; i++) {
    size = map(Math.log(frequencyData[i].count), 0, Math.log(frequencyData[0].count), 8, 30)
    textSize(size)
    text(frequencyData[i]._id, 50, y);
    y+=size
  }
}