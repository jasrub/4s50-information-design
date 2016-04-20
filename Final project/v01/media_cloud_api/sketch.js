var apiKey = "9a6a0874e114aa29583efd6775934125134e1c84115bfbed854673b34172b134"
var media_cloud_api = "https://api.mediacloud.org/api/v2/"

var hasData;
var frequencyData;
// Get word frequency counts for all sentences containing the word 'obama' in The New York Times, with stats data included
// https://api.mediacloud.org/api/v2/wc/list?q=obama+AND+media_id:1&stats=1
//https://api.mediacloud.org/api/v2/wc/list?key=9a6a0874e114aa29583efd6775934125134e1c84115bfbed854673b34172b134&q=obama&fq=publish_date:[2016-03-20T00:00:00.000Z%20TO%202016-03-30T00:00:00.000Z]&stats=1
function setup() {
  
  hasData = false;
  
  // create canvas
  createCanvas(710, 800);

  input = createInput();
  input.position(20, 20);

  button = createButton('submit');
  button.position(150, 20);
  button.mousePressed(getWordCountData);

  textAlign(CENTER)
  textSize(50);

}

function draw() {
  background(255)
  if (hasData) {
    showWordFrequency();
  }
  
}

CORS_PROXY = 'https:/' + '/CrossOrigin.me/'

function getWordCountData(query) {
  if (apiKey) {
    var end_date = new Date().toISOString();
    var start_date = incrementDate(Date.now(), -7).toISOString();
    var date_string = '['+start_date+ ' TO '+end_date+']'
    var query = input.value()
    var url = CORS_PROXY+'https://api.mediacloud.org/api/v2/wc/list?stats=1&key='
            + apiKey + '&q=sentence:'+query+'&fq=tags_id_media:8875027&fq=publish_date:'+date_string;
    print (encodeURI(url))
    loadJSON(encodeURI(url), loadCallback);
  }
}

var incrementDate = function (date, amount) {
    var tmpDate = new Date(date);
    tmpDate.setDate(tmpDate.getDate() + amount)
    return tmpDate;
};

function loadCallback (data){
  frequencyData = data
  frequencyData = frequencyData.sort(function(a,b) {return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0);} ); 
  frequencyData = frequencyData.slice(0,20)
  hasData = true;
}

function showWordFrequency() {
  y=70;
  print (frequencyData)
  for (i=0; i<frequencyData.length; i++) {
    size = map(Math.log(frequencyData[i].count), 0, Math.log(frequencyData[0].count), 8, 30)
    textSize(size)
    text(frequencyData[i].term, 50, y);
    y+=size
  }
}