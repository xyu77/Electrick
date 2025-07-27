// ======= CLASSES =======
// (No changes to class DrawLine or cmoGrid in this version)

/////////////////

class cmoGrid {
  // Contructor

  constructor(tempMyNumber, tempX, tempY, row, col) {
    this.myNumber = tempMyNumber;
    this.x = tempX;
    this.y = tempY;
    this.row = row;
    this.col = col;
    this.cmoCanvas = 10;
    this.fun = random(10);
    this.closeby = false;
    this.hideGrid = false;
    print("YAY! I AM BORN");
  }


  cmoUpdate() {
    if (dist(this.x, this.y, mouseX, mouseY) < cmoRolloverDistance) {
      this.cmoCanvas = 30;
    } else {
      this.cmoCanvas = griddotradius;
    }
  }

  // Custom method for drawing the object
  cmoDisplay() {
    
    
   if (hideGrid) {
  noFill();
  noStroke();
} else {
  fill(gridcolor + "FF"); // Full opacity
  strokeWeight(this.closeby ? 5 : 1);
}





    ellipse(this.x, this.y, this.cmoCanvas, this.cmoCanvas);
  }

  cmoCheckCloseby() {
    if (dist(this.x, this.y, mouseX, mouseY) < cmoRolloverDistance) {
      this.cmoCanvas = 30;
      this.closeby = true;
    } else {
      this.cmoCanvas = griddotradius;
      this.closeby = false;
    }
  }

  //// return means the value of let [checkDistance] only exist when dist is < 20

  checkDistance(xTemp, yTemp) {
    if (dist(xTemp, yTemp, this.x, this.y) < 30) {
      return true;
    } else {
      return false;
    }
  }
} ////ENd of class cmoGrid

// ===== File: DrawLine.js =====

class DrawLine {
  // Contructor
  constructor(tempX, tempY) {
    print("YAY NEW LINE MADE!");
    this.drawLine = [];
    this.active = true;
    this.closeby = false;
    this.closestDotNumber = 0;
    this.startLine(tempX, tempY);
    this.myLinePoints = [];
  }

  cmoUpdate() {
    if (this.active) {
      print("drawing is active");

      //if (mousePressed && (mouseButton == RIGHT)) endLine();
    }

    //if (key == 'b') {
    // addPoint(mouseX, mouseY);}
  }

  cmoDisplay() {
    strokeWeight(1);
    stroke(strokecolor);
    ////// add newby in arraylist, line(x,y,x+1,y+1)

    for (let i = 0; i < this.drawLine.length - 1; i++) {
      //line(drawLine.get(i).x, drawLine.get(i).y, drawLine.get(i+1).x, drawLine.get(i+1).y);

      ////// add electric version of line
      this.electricLine(
        this.drawLine[i].x,
        this.drawLine[i].y,
        this.drawLine[i + 1].x,
        this.drawLine[i + 1].y
      );
    }

    /////// make the line sticky to mouse
    if (this.drawLine.length >= 1 && currentlyDrawing && this.active) {
      line(
        this.drawLine[this.drawLine.length - 1].x,
        this.drawLine[this.drawLine.length - 1].y,
        mouseX,
        mouseY
      );
    }
  }

  startLine(tempX, tempY) {
    currentlyDrawing = true;
    //cmoLineListOfPoints.add(new PVector(tempX, tempY));
    this.findClosestDot(mouseX, mouseY);

    this.tempMod = cmoGridList[this.closestDotNumber];

    print("startline");

    this.drawLine.push(createVector(this.tempMod.x, this.tempMod.y));
  }

  addPoint(tempX, tempY) {
    this.findClosestDot(mouseX, mouseY);
    // CmoModule
    this.tempMod = cmoGridList[this.closestDotNumber];

    if (this.active) {
      //    print("this.active");
      this.drawLine.push(createVector(this.tempMod.x, this.tempMod.y));
    }
    print("addpoint");
  }

  endLine() {
    print("endline");
    this.active = false;
    currentlyDrawing = false;
  }

  printDotNames() {
    print("Grid indices in this line:");
    for (let pt of this.drawLine) {
      // Find matching cmoGrid from cmoGridList
      for (let grid of cmoGridList) {
        if (grid.x === pt.x && grid.y === pt.y) {
          print(`[ ${grid.col},${grid.row}]`);
          //  break;
        }
      }
    }
  }

  electricLine(tempX, tempY, tempX2, tempY2) {
    let distance = dist(tempX, tempY, tempX2, tempY2);
    let angle = atan2(tempY2 - tempY, tempX2 - tempX);

    let steps = 5; // Number of segments in the line
    let wiggleAmp = wiggleSlider.value(); // Wiggle amplitude

    let wiggleFreq = 0.1; // Noise frequency

    push();
    translate(tempX, tempY);
    rotate(angle);
    noFill();
    strokeWeight(1);

    beginShape();
    vertex(0, 0);

    for (let i = 1; i < steps; i++) {
      let t = i / steps;
      let x = t * distance;

      // Make each point wiggle uniquely
      //   let y = noise(frameCount * 0.05 + i * 10 + xoff) * 2 - 1; // [-1,1]

      let y =
        sin(frameCount * 0.5 + i * 2) * random(wiggleAmp * 0.3, wiggleAmp);
      y *= random(wiggleAmp * 0.5, wiggleAmp); // scale y randomly

      vertex(x, y);
    }

    vertex(distance, 0);
    endShape();
    pop();
  }
  ///// little hard to understand part,
  ///// closestDotNumber is a int,
  ///// checkDistance is a boolean that returns when closest
  ///// myNumber is a int that represent the order of the dot-grid
  ///// the value of boolean [checkDistance] only exist when dist is < 20

  findClosestDot(tempX, tempY) {
    for (let xxTemp of cmoGridList) {
      if (xxTemp.checkDistance(tempX, tempY)) {
        this.closestDotNumber = xxTemp.myNumber;
      }
    }
  }
} ///end of class DrawLine
