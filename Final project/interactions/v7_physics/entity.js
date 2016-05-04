function Entity(name, count) {
  this.name = name;
  this.count = count;
  this.x = 0;
  this.y = 0;
  
  this.sizeText = map(this.count, 0, maxCount, 15, 40)
  this.string = trim(this.name.capitalizeFirstLetter())
  this.stringWidth = 0
  
  this.c = 0
  this.textColor = 0
  this.isAnimating = false
  this.targetX = 0;
  this.targetY = 0;
  this.sourceX = this.x
  this.sourceY = this.y
  this.targetSize = this.radius
  this.sizeStep = 0
  this.moveVector = createVector(0,0)
  
  this.steps = 60*1.0
  this.currStep  = 0
  this.percent  = 0
  
  
  this.setTarget = function(targetX, targetY, targetSize) {
    this.isAnimating = true
    this.currStep  = 0
    this.percent  = 0
    this.sourceX = this.x
    this.sourceY = this.y
    this.targetX = targetX;
    this.targetY = targetY;
    this.targetSize = targetSize;
    this.moveVector = createVector(targetX, targetY).sub(createVector(this.x, this.y)).div(this.steps)
    this.sizeStep = (this.targetSize-this.radius)/this.steps
  }
  
  this.update = function() {
    if (this.isAnimating) {
      if (this.currStep>this.steps) {
        // this.x = this.targetX
        // this.y = this.targetY
        this.isAnimating = false
        return
      }

      var p = this.percent;
      p=(sqrt(p)+ p*p)/2;

      newLocation = p5.Vector.lerp(createVector(this.sourceX, this.sourceY), createVector(this.targetX, this.targetY), p);
      this.x = newLocation.x
      this.y = newLocation.y
      this.radius+=this.sizeStep
      this.currStep++
      this.percent = this.currStep/this.steps
    }
  }

  this.highlight = function() {
    this.c = color('rgb(182, 197, 201)')
    this.textColor = color('rgb(182, 197, 201)')
  }
  
  this.unhighlight = function() {
    this.c = 0
    this.textColor = 0
  }

  this.display = function(x=this.x, y=this.y) {
    push();
    fill(255)
    stroke(this.c)
    rectMode(CENTER);
    rect(x, y, this.stringWidth+20, this.sizeText*3);
    
    noStroke()
    rect(x, y,this.stringWidth-10, this.sizeText*3+5);
    rect(x, y, this.stringWidth+25, this.sizeText*3-30);
    
    pop();
    //this.displayText()
  }
  this.displayText = function(x=this.x, y=this.y) {
    push();
    textAlign(CENTER, CENTER)
    noStroke();
    fill(this.textColor)
    textSize(this.sizeText)
    textFont (robotoFontBold)
    text(this.string, x, y)
    this.stringWidth = textWidth(this.string)
    //text(trim(this.name.split(' ').join('\n').capitalizeFirstLetter()), this.x, this.y)
    pop();
  }


  this.containsCursor = function() {
    return sq((mouseX - this.x) / this.radius) + sq((mouseY - this.y) / this.radius) < 0.25;
  }
}