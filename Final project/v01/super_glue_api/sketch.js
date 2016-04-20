//get word count
//http://super-glue.media.mit.edu/word_count?limit=30&offset=30 
// get media (top 10 by upload date)
//http://super-glue.media.mit.edu/media
//http://super-glue.media.mit.edu/media?limit=30&keywords=fbi
//http://super-glue.media.mit.edu/get_trends_entities

hasSuperGlueData = false
function setup() {
  createCanvas(1000,1000)
  getTrendingEntities();
  
}

function draw() {
  background(255)
  if (hasSuperGlueData) {
    showWordFrequency();
  }
  
}


CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getTrendingEntities() {
    var url = 'http://super-glue.media.mit.edu/get_trends_entities'
    loadJSON(encodeURI(url), loadCallback);
}

function loadCallback (data){
  print (data);
  results = data.results;
  frequencyData  = results;
  hasSuperGlueData = true;
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