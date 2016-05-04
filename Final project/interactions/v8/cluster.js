// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Force directed graph
// Heavily based on: http://code.google.com/p/fidgen/

function Cluster(n,d,nodes, connectionsMatrix) {
  // A cluster is a grouping of nodes
  this.nodes = [];
  // Set the diameter
  this.diameter = d;
  
  this.connections = connectionsMatrix
  this.collisonSprings = []
  
  this.shownEntities = []
  for (var i=0; i<nodes.length ; i++) {
    this.shownEntities.push(false)
  }
  
  this.initialMode = true
  this.selected = false
  
  //calculate the svd result
  // first create the list of indexs to show
  for (var i=offset; i<offset+numOfEntitiesToShow; i++) {
    this.shownEntities[i] = true
  }
  this.sMatrix = connectionsMatrix.map(function(value, index){ return value.map(function(value, index){r = value> 0.001 ? 1 : 0; return r;})})
  svdResult = getSvdMinMax(sMatrix)

  // Create the nodes
  for (var i = 0; i < nodes.length; i++) {
    pos = calculateXY(svdResult, i, this.shownEntities, grid.margin.right+grid.colwidth()+maxRadius*2, width-grid.margin.right-maxRadius*2, grid.margin.top+maxRadius, height-grid.margin.top-maxRadius)
    node = new Node(nodes[i][0], nodes[i][1], pos)
    this.nodes.push(node);
  }
  // Connect all the nodes with a Spring
  
  // for (var i = 0; i < this.nodes.length; i++) {
  //   for (var j = i+1; j < this.nodes.length; j++) {
  //     // A Spring needs two particles, a resting length, and a strength
  //     //var length = (max(this.nodes[i].w, this.nodes[i].h)+max(this.nodes[j].w, this.nodes[j].h))/2
  //     //var length = (this.nodes[i].r+ this.nodes[j].r)/2 + 15
  //     //this.collisonSprings.push(new VerletMinDistanceSpring2D(this.nodes[i], this.nodes[j], length, 0.1))
  //   }
  // }
  
  this.addCollisonSprings = function() {
    //physics.springs = []
    for (var i=0; i<this.nodes.length; i++) {
      for (var j=0; j<this.nodes.length; j++){
        if (this.shownEntities[i] && this.shownEntities[j]){
          var length = (this.nodes[i].r+ this.nodes[j].r)/2 + 15
          physics.addSpring(new VerletMinDistanceSpring2D(this.nodes[i], this.nodes[j], length, 0.1))
        }
      }
    }
    // for (var i = 0; i < this.collisonSprings.length; i++) {
    //   physics.addSpring(this.collisonSprings[i])
    // }
  }
  this.addCollisonSprings()
  
  this.display = function() {
    // Show all the nodes
    this.run();
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].display();
    }
  }
  
  this.run = function() {
    var hover = false
    for (i=0; i<this.nodes.length; i++){
      this.nodes[i].unhighlight()
    }
    for (i=0; i<this.nodes.length; i++){
      //this.nodes[i].unhighlight()
      if (this.shownEntities[i] && this.nodes[i].containsCursor()) {
        hover = true
        this.nodes[i].highlight()
        for (j = 0; j < this.nodes.length; j++) {
          if (this.connections[j][i] > 0) {
              this.nodes[j].highlight()
          }
        }
      }
    }
  }
  
  this.moveNodeToTarget = function(i, target) {
    targetPoint = new VerletParticle2D(target)
    targetPoint.lock()
    physics.addSpring(new VerletSpring2D(this.nodes[i], targetPoint, 1, 0.005))
  }
  
  this.mouseClick = function(x,y) {
    if (videosMode) {
      if (selected!=-1) {
      //video relation: 16*9
      for(var i = 0; i<this.nodes.length; i++){
      if (this.nodes[i].containsCursor()) {
        selectedPair= i
        keyPair = sort([this.nodes[selected].name, this.nodes[i].name]).join(',')
        videoLink = entitiesMatrix[keyPair].matching_caps[0].link
        this.moveNodeToTarget(i, Vec2D(grid.margin.left+grid.colwidth()*1.5, grid.margin.top+grid.rowheight()*7))
        if (!(selected==i && playing)) {
          currVid.setLink(videoLink)
          currVid.play()
          playing = true
        }
        break;
        //return;
      }
      }
      //entities[selected].isSelected = true
      return 
      }
    }
    var foundSelected = false
    for(var i=0; i<this.nodes.length; i++) {
      if (this.nodes[i].containsCursor()) {
        selected = i
        foundSelected = true
        break;
      }
    }
   if (foundSelected) {
     physics.springs = []
     this.moveNodeToTarget(selected, new Vec2D(grid.margin.left+grid.colwidth()*1.5, grid.margin.top+grid.rowheight()*4))
    // for (var i=0; i<this.nodes.length; i++){
    //   this.shownEntities[i] = false
    // }
     indexList = []
     
     for (var i=0; i<this.nodes.length; i++) {
      indexList.push(this.connections[selected][i]>0? true: false)
     }
     indexList[selected] = true
     this.shownEntities = indexList
     tempMatrix = this.sMatrix.map(function(value, index){
       return value.map(function(value, index){
         return indexList[index]? value: 0
        })
       })
     tempSvdResult = getSvdMinMax(tempMatrix)
     for (i=0; i<this.nodes.length; i++) {
       if (i!=selected) {
          pos = calculateXY(tempSvdResult, i, indexList, width/2+maxRadius, width-maxRadius, grid.margin.top+maxRadius, height-grid.margin.right-maxRadius)
          this.moveNodeToTarget(i, pos)
       }
     }
     this.addCollisonSprings()
   }
   else {
     selected = -1
   }
  }

  // Draw all the internal connections
  this.showConnections = function() {
    stroke(100, 100);
    strokeWeight(1);
    for (var i = 0; i < this.nodes.length-1; i++) {
      for (var j = i+1; j < this.nodes.length; j++) {
        if (this.connections[i][j]>0)
          line(this.nodes[i].x, this.nodes[i].y, this.nodes[j].x, this.nodes[j].y);
      }
    }
  }
}


function getSvdMinMax(adjancyMatrix) {
  svdResult = numeric.svd(sMatrix);
  r = {}
  r.svdMatrix = svdResult
  r.minX = 100
  r.maxX = -100
  r.minY = 100
  r.maxY = -100
  for (i = 0; i < numOfEntitiesToShow; i++){//svdResult.U.length; i++) {
    r.minX = svdResult.U[i][0] < r.minX ? svdResult.U[i][0] : r.minX
    r.minY = svdResult.U[i][1] < r.minY ? svdResult.U[i][1] : r.minY
    r.maxX = svdResult.U[i][0] > r.maxX ? svdResult.U[i][0] : r.maxX
    r.maxY = svdResult.U[i][1] > r.maxY ? svdResult.U[i][1] : r.maxY
  }
  return r
}

function calculateXY(svdResult, i, indexList, minW, maxW, minH, maxH) {
  if (!indexList[i]) {
    mappedX = width*2
    mappedY = height/2
  }
  else {
  mappedX = map(svdResult.svdMatrix.U[i][0], svdResult.minX, svdResult.maxX, minW, maxW)
  mappedY = map(svdResult.svdMatrix.U[i][1], svdResult.minY, svdResult.maxY, minH, maxH)
  }
  return (new Vec2D(mappedX, mappedY))
}

