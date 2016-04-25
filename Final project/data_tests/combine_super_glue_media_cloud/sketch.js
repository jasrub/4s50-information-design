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

var loadLocal = true
hasSuperGlueData = false
function preload() {
  if (!loadLocal) {
    getTrendingEntities();
  }
  else {
    loadJSON('trendsData_try2.json', function tempCallback(data) {
    //print (data)
    trendsData = data;
    });
  }
}

function setup() {
  createCanvas(1000,1000)
  print (trendsData)
  for (entity in trendsData) {
    //print (entity)
    entities.push(entity)
  }
  print (entities)
  for (entity in trendsData) {
    entitiesMatrix[entity] = []
    for (i=0; i<entities.length; i++) {
      //print (trendsData[entity])
      if ("frequency" in trendsData[entity]) {
        for (j=0; j<trendsData[entity].frequency.length; j++) {
          if (trendsData[entity].frequency[j].term.toLowerCase()==entities[i].toLowerCase()) {
            curr_entity = entities[i]
            newObj = [curr_entity, (trendsData[entity].frequency[j].count)/(trendsData[entity].stats.num_sentences_found)]
            //newObj[curr_entity] =  (trendsData[entity].frequency[j].count)/(trendsData[entity].stats.num_sentences_found)
            entitiesMatrix[entity].push(newObj)
          }
        }
      }
    }
  }
  //print (entitiesMatrix)
  if (!loadLocal) {
    saveJSONObject(trendsData, 'trendsData_try3.json');
  }
  
}

function draw() {
  background(255)
  drawEntitiesMatrix()
}

function drawEntitiesMatrix() {
  matSize = 500;
  pixelSize  = matSize/entities.length
  for (i=0; i<entities.length; i++) {
    for (j=0; j<entities.length; j++) {
      rectColor = 255
      for (k=0; k<entitiesMatrix[entities[i]].length; k++) {
        //print("i: "+i+ "j: "+j+ " "+entitiesMatrix[entities[i]][k])
        if (entitiesMatrix[entities[i]][k][0]==entities[j]) {
          rectColor = 0
          rectColor = map(entitiesMatrix[entities[i]][k][1], 0.00001,0.1,100,0)
        }
      }
      fill(rectColor)
      rect (j*pixelSize, i*pixelSize, pixelSize, pixelSize);
      //rect (i*pixelSize, j*pixelSize, pixelSize, pixelSize);
    }
  fill(0)
  textAlign(LEFT,CENTER)
  text (entities[i], 505, i*pixelSize+pixelSize/2)
  push();
  translate(i*pixelSize+pixelSize/2, 505)
  rotate(radians(90))
  text (entities[i], 0, 0)
  pop();
  }
}
CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getTrendingEntities() {
    var url = 'http://super-glue.media.mit.edu/get_trends_entities?limit=40&aligned='
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
    getWordCountData(entity)
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