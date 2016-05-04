// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Force directed graph
// Heavily based on: http://code.google.com/p/fidgen/

// Notice how we are using inheritance here!
// We could have just stored a reference to a VerletParticle object
// inside the Node object, but inheritance is a nice alternative

function Node(name,count, pos) {
  VerletParticle2D.call(this,pos);
  
  this.maxspeed = 30
  this.name = name
  //this.entity = entity
  this.count = count

  //display vars
  this.sizeText = map(this.count, 0, maxCount, 15, 40)
  this.string = trim(this.name.capitalizeFirstLetter())
  this.bbox = robotoFontBold.textBounds(name.split(' ').join('-').capitalizeFirstLetter(), round(pos.x), round(pos.y), this.sizeText);
  this.h = this.bbox.h*3
  this.w = this.bbox.w+20
  
  this.stringWidth = 0
  this.c = 0
  this.textColor = 0
  
  this.drawRect = function() {
    push();
    fill(255)
    stroke(this.c)
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
    
    noStroke()
    rect(this.x, this.y,this.w-10, this.h+5);
    rect(this.x, this.y, this.w+25, this.h-10);
    
    pop();
  }
  this.displayText = function() {
    push();
    textAlign(CENTER, CENTER)
    noStroke();
    fill(this.textColor)
    textSize(this.sizeText)
    textFont (robotoFontBold)
    text(this.string, this.x, this.y)
    pop();
  }

  // Override the display method
  this.display = function(){
    this.drawRect()
    this.displayText()
  }
  
  this.highlight = function() {
    this.c = color('rgb(182, 197, 201)')
    this.textColor = color('rgb(182, 197, 201)')
  }
  
  this.unhighlight = function() {
    this.c = 0
    this.textColor = 0
  }
  
  this.containsCursor = function() {
    return (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2) &&
          (mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2);
  }
  
}

// Inherit from the parent class
Node.prototype = Object.create(VerletParticle2D.prototype);
Node.prototype.constructor = Node;


