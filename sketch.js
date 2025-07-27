// ===== GLOBAL VARIABLES =====
let wiggleSlider;
let toggleButton;

let capturer;
let recording = false;
let recordStartFrame;
let recordDuration = 90; // 3 seconds * 30 fps


let showGrid = true;
let currentlyDrawing = false;
let cmoGridList = [];
let cmoLineList = [];
let i1 = 0;

let rows = 0;
let cols = 0;
let n;
let xoff = 0.0;
let active = true;

let gridXMin, gridXMax, gridYMin, gridYMax;

//-- UI COLORS / SIZES --
let bgcolor = 0;
let reversebgcolor = 255;
let titlecolor = 255;
let reversetitlecolor = 0;
let strokecolor = 255;
let reversestrokecolor = 0;
let gridcolor = "#c2c2c2";
let mousecircleradius = 30;
let griddotradius = 1;
let cmoRolloverDistance = 30;

// ======= SETUP & DRAW =======

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  createUI(); // create slider + toggle

  toggleButton.html("Light Mode 🌞");
toggleButton.style("background-color", "#ffffff");
toggleButton.style("color", "#000000");
toggleButton.style("border", "1px solid #ccc");
toggleButton.style("padding", "5px 10px");
toggleButton.style("border-radius", "5px");
  toggleButton.style("transition", "all 0.3s ease");
toggleButton.style("font-weight", "bold");
  
  
  // create the grid
  i1 = 0;
  for (let y = windowHeight / 6; y <= (windowHeight / 6) * 5; y += 10) {
    cols = 0;
    for (let x = windowWidth / 6; x <= (windowWidth / 6) * 5; x += 10) {
      let a = new cmoGrid(i1, x, y, rows, cols);
      cmoGridList.push(a);
      i1++;
      cols++;
    }
    rows++;
  }

  gridXMin = windowWidth / 6;
  gridXMax = (windowWidth / 6) * 5;
  gridYMin = windowHeight / 6;
  gridYMax = (windowHeight / 6) * 5;
  
  
   capturer = new CCapture({
    format: "gif",
    workersPath: "./", // or a valid local folder
    framerate: 30,
    verbose: true,
  });
}

function draw() {
  background(bgcolor);
  xoff += 1;

  for (let dot of cmoGridList) {
    dot.cmoUpdate();
    dot.cmoDisplay();
  }

  for (let line of cmoLineList) {
    line.cmoUpdate();
    line.cmoDisplay();
  }

  drawMouseCircle();
  titletext();
  drawSliderLabel();



  // Draw modal if visible
  if (showConfirmModal) {
    drawConfirmModal();
  }
  
if (recording) {
  capturer.capture(document.querySelector("canvas"));

  if (frameCount - recordStartFrame >= recordDuration) {
    capturer.stop();
    capturer.save();
    recording = false;
    console.log("Recording done!");
  }
}
  
}

// ======= UI: SLIDER + BUTTONS =======

function createUI() {
  
  let gifButton = createButton("🎞️ Save 3s GIF");
gifButton.position(20, 100);
gifButton.mousePressed(startGifCapture);
  
  wiggleSlider = createSlider(0, 15, 5, 0.1);
  wiggleSlider.position(20, 20);
  wiggleSlider.style('width', '200px');

  toggleButton = createButton("Toggle mode");
  toggleButton.position(20, 60);
  toggleButton.mousePressed(toggleBackground);
  
  
  
  
  
}

function drawSliderLabel() {
  fill(titlecolor);
  noStroke();
  textSize(12);
  text("Wiggle Amplitude: " + wiggleSlider.value(), 240, 25);
}

// ======= INPUT =======

function mousePressed() {
  if (!isMouseInGrid()) return;

  for (let dot of cmoGridList) dot.cmoCheckCloseby();

  if (!currentlyDrawing) {
    let newLine = new DrawLine(mouseX, mouseY);
    cmoLineList.push(newLine);
    currentlyDrawing = true;
  } else {
    let tempDot = cmoLineList[cmoLineList.length - 1];
    tempDot.addPoint(mouseX, mouseY);
  }
}

function mouseDragged() {
  if (currentlyDrawing && cmoLineList.length > 0) {
    let lastLine = cmoLineList[cmoLineList.length - 1];
    lastLine.addPoint(mouseX, mouseY);
  }
}

function mouseReleased() {
 // if (!isMouseInGrid()) return;

  for (let dot of cmoGridList) dot.cmoCheckCloseby();

  if (currentlyDrawing && cmoLineList.length > 0) {
    let lastLine = cmoLineList[cmoLineList.length - 1];
    lastLine.endLine();
    lastLine.printDotNames();
  }
}

function keyPressed() {
if (key === " ") {
    showConfirmModal = true;
    createModalButtons();
  }

  if (key === "r" && !recording) {
    recording = true;
    recordStartFrame = frameCount;
    capturer.start();
    console.log("Recording started");
  }

  if (keyCode === RETURN) {
    if (cmoLineList.length > 0) {
      let lastLine = cmoLineList[cmoLineList.length - 1];
      if (lastLine.active) {
        lastLine.endLine();
        lastLine.printDotNames();
      }
    }
  }
}

// ======= UTILITY =======

function drawMouseCircle() {
  fill("#FF0000");
  noStroke();
  ellipse(mouseX, mouseY, mousecircleradius, mousecircleradius);
}

function toggleBackground() {
   showGrid = !showGrid;

  // Add bounce effect
  toggleButton.style("transform", "scale(1.1)");
  setTimeout(() => toggleButton.style("transform", "scale(1.0)"), 150);

  if (showGrid) {
    bgcolor = 0;
    strokecolor = 255;
    titlecolor = 255;
    toggleButton.html("Light Mode 🌞");
    toggleButton.style("background-color", "#ffffff");
    toggleButton.style("color", "#000000");
  } else {
    bgcolor = reversebgcolor;
    strokecolor = reversestrokecolor;
    titlecolor = reversetitlecolor;
    toggleButton.html("Dark Mode 🌙");
    toggleButton.style("background-color", "#333333");
    toggleButton.style("color", "#ffffff");
  }
}

function isMouseInGrid() {
  return mouseX >= gridXMin && mouseX <= gridXMax && mouseY >= gridYMin && mouseY <= gridYMax;
}

function titletext() {
  fill(titlecolor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Electrick CM", windowWidth / 2, 50);

  textSize(10);
  text("CONNECT DOTS", windowWidth / 2, windowHeight - 60);
  text("SPACEBAR TO HIDE GRID / PRESS ` TO RECORD", windowWidth / 2, windowHeight - 50);
}





// ======= CLASSES =======
// (No changes to class DrawLine or cmoGrid in this version)




/////////////////


class cmoGrid {
  // Contructor

  constructor(tempMyNumber, tempX, tempY,row, col) {
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

 // keyReleased() {
 //   if (key == "h") {
  //    hideGrid = !hideGrid;   }
 // }

  cmoUpdate() {
    if (dist(this.x, this.y, mouseX, mouseY) < cmoRolloverDistance) {
      this.cmoCanvas = 30;
    } else {
      this.cmoCanvas = griddotradius;
    }


  }

  // Custom method for drawing the object
  cmoDisplay() {
    if (!this.hideGrid) {
      if (this.closeby) {
        fill(gridcolor);
        strokeWeight(5);
      } else {
        fill(gridcolor);
        strokeWeight(1);
      }
    } else {
      stroke(0);
      noFill();
      strokeWeight(0);
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
  let wiggleAmp = wiggleSlider.value();// Wiggle amplitude
 
    
    
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
    
    let y = sin(frameCount * 0.5 + i * 2) * random(wiggleAmp * 0.3, wiggleAmp);
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
}///end of class DrawLine

function startGifCapture() {
  if (!recording) {
    recording = true;
    recordStartFrame = frameCount;
    capturer.start();
    console.log("GIF recording started.");
  }
}
