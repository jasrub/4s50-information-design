var playing = false;

var videoLink = "";

function Video() {
  this.vid = createVideo("assets/blank-video.mp4")
  this.w = grid.colwidth() 
  this.h = this.w*9/16
  this.x = grid.margin.left
  this.y = grid.margin.top+grid.rowheight()*4
  //this.vid = createVideo("")
  this.vid.size(this.w, this.h)
  this.vid.position(this.x, this.y)
  //this.vid.mousePressed(this.toggleVid)
  
  this.toggleVid = function() {
  if (playing) {
    currVid.pause();
    //currVid.hide()
  } else {
    //currVid.show()
    currVid.play();
  }
  playing = !playing;
  }
  
  this.setLink = function(link){
    this.vid.src = link
  }
  
  this.play = function(){
    this.vid.play()
  }
  
  this.drawRect = function(){
    push()
    rectMode(CORNER)
    fill(0)
    noStroke()
    rect(this.x, this.y, this.w, this.h)
    pop()
  }

}