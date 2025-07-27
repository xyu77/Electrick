// ===== GLOBAL VARIABLES =====
let wiggleSlider;
let toggleButton;
let saveButton;

let startingAmp=4;
let screenshotmode = false;
let darkMode = true;
let hideGrid; // New flag to toggle grid visibility
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
let gridcolor="#7c7c7c";
let mousecircleradius = 30;
let griddotradius = 1.5;
let cmoRolloverDistance = 30;

// ======= SETUP & DRAW =======

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  createUI();
  toggleDarkMode(true); // Start in dark mode

  // Create the grid
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

  if (!screenshotmode) {
    drawMouseCircle();
    titletext();
    drawSliderLabel();
  }
}

function createUI() {
  wiggleSlider = createSlider(0, 15, startingAmp, 0.1);
  wiggleSlider.position(20, 20);
  wiggleSlider.style('width', '200px');

  toggleButton = createButton("Toggle Mode");
  toggleButton.position(20, 60);
  toggleButton.mousePressed(() => toggleDarkMode(!darkMode));

  saveButton = createButton("\ud83d\udcf8 Save Screenshot");
  saveButton.position(20, 100);
  saveButton.mousePressed(saveScreenshot);
}

function drawSliderLabel() {
  fill(titlecolor);
  noStroke();
  textSize(12);
  text("Wiggle Amplitude: " + wiggleSlider.value(), 240, 25);
}

function drawMouseCircle() {
  fill("#FF0000");
  noStroke();
  ellipse(mouseX, mouseY, mousecircleradius, mousecircleradius);
}

function titletext() {
  fill(screenshotmode ? color(0, 0, 0, 0) : (darkMode ? titlecolor : reversetitlecolor));
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Electrick CM", windowWidth / 2, 50);

  textSize(10);
  text("CONNECT DOTS", windowWidth / 2, windowHeight - 60);
  text("SPACEBAR TO HIDE GRID / PRESS ` TO RECORD", windowWidth / 2, windowHeight - 50);
}

function toggleDarkMode(isDark) {
  darkMode = isDark;
  if (darkMode) {
    bgcolor = 0;
    strokecolor = 255;
    titlecolor = 255;
    gridcolor = "#7c7c7c";
    toggleButton.html("Light Mode \ud83c\udf1e");
    toggleButton.style("background-color", "#ffffff");
    toggleButton.style("color", "#000000");
  } else {
    bgcolor = reversebgcolor;
    strokecolor = reversestrokecolor;
    titlecolor = reversetitlecolor;
    gridcolor = "#7c7c7c";
    toggleButton.html("Dark Mode \ud83c\udf19");
    toggleButton.style("background-color", "#333333");
    toggleButton.style("color", "#ffffff");
  }
}

function saveScreenshot() {
  screenshotmode = true;
  toggleButton.hide();
  wiggleSlider.hide();
  saveButton.hide();

  redraw();

  setTimeout(() => {
    saveCanvas("electrick_screenshot", "png");
    screenshotmode = false;
    toggleButton.show();
    wiggleSlider.show();
    saveButton.show();
  }, 100);
}

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
  for (let dot of cmoGridList) dot.cmoCheckCloseby();
  if (currentlyDrawing && cmoLineList.length > 0) {
    let lastLine = cmoLineList[cmoLineList.length - 1];
    lastLine.endLine();
    lastLine.printDotNames();
  }
}

function keyPressed() {

if (key === " ") {
    hideGrid = !hideGrid;
    print("Grid visibility:", hideGrid ? "Hidden" : "Shown");
  }

  if (keyCode === RETURN && cmoLineList.length > 0) {
    let lastLine = cmoLineList[cmoLineList.length - 1];
    if (lastLine.active) {
      lastLine.endLine();
      lastLine.printDotNames();
    }
  }
}

function isMouseInGrid() {
  return mouseX >= gridXMin && mouseX <= gridXMax && mouseY >= gridYMin && mouseY <= gridYMax;
}






