var today_docs
// // Mongodb variables
// var MongoClient;
// var assert;
// var ObjectId;
// var url = 'mongodb://um.media.mit.edu:27017/super-glue';

// function preload(){
//   MongoClient = require('mongodb').MongoClient;
//   assert = require('assert');
//   ObjectId = require('mongodb').ObjectID;
  
//   console.log("in preload")
//   MongoClient.connect(url, function(err, db) {
//     console.log("in connect")
//   assert.equal(null, err);
//   findRestaurants(db, function() {
//       db.close();
//     });
//   });
// }

function setup() {
  createCanvas(400,400)
  
}

function draw() {
  background(0)
  //console.log(today_docs)
}

var findRestaurants = function(db, callback) {
  console.log('in find restaurants')
   var cursor =db.collection('media').find( { "date_added": {"$gt": millis()-86400000 }} );
   console.log('doing each on cursor')
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};