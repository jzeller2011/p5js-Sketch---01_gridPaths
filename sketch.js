let degreeSlider;
let offsetsSlider;
let gridSlider;
let restartBttn;
let flipBttn;

let usrPnts = []
let usrPaths = []
let usrRotations = []
let r = 1; // Initialize the rotation (1 is clockwise, -1 is counter-clockwise)
let maxLength = 6
let cols;
let rows;
let canvasWidth = 600
let canvasHeight = 800


p.setup = function () {

  if (p.type === "SVG") {
    p.createCanvas(canvasWidth, canvasHeight, p.SVG);
  }
  else if (p.type === "NORMAL") {
    p.createCanvas(400, 400);
  }
  else {
    alert("don't know which canvas to create")
  }
  
  p.angleMode(DEGREES)
  p.noLoop();
  };

  p.draw = function () {

    clear()
    gridSize = gridSlider.value();
    cols = width / gridSize;
    rows = height / gridSize;

    // Draw the canvas Boundary
    fill('white')
    stroke('black')
    quad(0, 0, width, 0, width, height, 0, height)

    drawGrid(gridSize)

    strokeWeight(3)

    // Parameters to set grid


    var g = degreeSlider.value();
    var m = offsetsSlider.value();
    
    noFill()
    
    for (let i = 0; i < usrPaths.length; i++) {drawPath(usrPaths[i], g, m, usrRotations[i])}
    drawPath(usrPnts, g, m, r)
  }

function setup() {
  
   renderer = []
   // Create column of Sliders
   offsetLabel = createP('Offset Distance')
   offsetLabel.parent('drawingControls')
   degreeSlider = createSlider(0, 100, 80, 0.0125);
   degreeSlider.input(() => {redraw()})
   degreeSlider.size(150);
   degreeSlider.parent('drawingControls')
 
 
   //  Multiple offset slider
   offsetsSlider = createSlider(1, 15, 1, 1)
   label = createP('Number of offsets')
   label.parent('drawingControls')
   offsetsSlider.input(() => {redraw()})
   offsetsSlider.size(150)
   offsetsSlider.parent('drawingControls')

  //  Grid Size
  gridSlider = createSlider(20, 300, 80, 1)
  gridLabel = createP('Grid Size (resets drawing)')
  gridLabel.parent('drawingControls')
  gridSlider.input(() => {redraw()})
  gridSlider.changed(() => {resetDrawing()})
  gridSlider.size(150)
  gridSlider.parent('drawingControls')
   

  // Restart Path Button
  restartLabel = createP('Current Path Controls')
  restartLabel.parent('drawingControls')
  restartBttn = createButton('Restart Current Path')
  restartBttn.parent('drawingControls')
  restartBttn.mouseClicked(resetPath)

  // Flip current Path Button
  flipBttn = createButton('Flip Cur}}rent Path')
  flipBttn.parent('drawingControls')
  flipBttn.mouseClicked(flipPath)

  //  New Path Button
  button = createButton('start new path')
  button.parent('drawingControls')
  button.mouseClicked(createNewPath)

  // Checkbox to preview in SVG
  preview = createCheckbox()
  if (preview.checked()) {renderer = 'SVG'}
  else {renderer = 'WEBGL'}
  label = createP('Preview in SVG')
  label.parent('drawingControls')
  preview.parent('drawingControls')
  
  
  canvas = createCanvas(600, 800, renderer)
  canvas.parent("canvas")
  frameRate (10)
  angleMode(DEGREES)
  noLoop();


  

}


cvs = new p5(sketch, "canvas");
cvs.type = "NORMAL";

svg = new p5(sketch, "hidden_div");
svg.type = "SVG";

// HELPER FUNCTIONS BELOW HERE

function flipPath() {
  r *= -1;
  redraw();
}

function resetPath() {
  usrPnts.length = 0;
  redraw()
}

function resetDrawing() {
  usrPnts.length = 0
  usrPaths.length = 0
  redraw()
}

function drawPath(pnts, g, m, r) {
  let rHistory = []; // debugging variable, records the rotation direction for each set of points
  let lastDir = {x: 0, y: 0}; // Records the direction of the last set of points as a vector
  let turnCount = 1 // depreciated - counts number of segments drawn in the current rotation direction
  let turnHistory = [] // depreciated debugging variable - records the turn count for each set of points
  let startCap = false
  let endCap = false
  
  let color = [] // Initialize the offset colors - one color for each offset
  for (let i = 0; i < m; i++) {color.push({r: random(255), g: random(255), b: random(255)})} // randomly select colors
  if (pnts.length == 1) { // draw circles if the path only has 1 point
    p1 = pnts[0];
    for (let i = m*2; i > 0; i--) {cascadingCircle(p1, g*i, color[i-1])} 
  }
  if (pnts.length > 1) { // if there's more than one point...
    for (let i = 0; i < pnts.length -1; i++) { // for each set of points
      let p1 = pnts[i]; 
      let p2 = pnts[i+1];
      let dir = {x: Math.sign(p1.x - p2.x), y: Math.sign(p1.y - p2.y)} // x and y vector lengths for the segment
      console.clear()
      if (lastDir.x == dir.x && lastDir.y == dir.y ) {r *= -1; turnCount = 1} // 
      // if (turnCount == 3 ) {r *= -1; turnCount = 1}
      turnHistory.push(turnCount); rHistory.push(r)
      console.log(lastDir, dir, "Rotation: ", r, "Number of Segments: ", turnCount)
      console.log("turn history: ", turnHistory); 
      console.log("rotation history: ", rHistory)

      if (i == 0) {startCap=true} else {startCap=false}
      if (i == pnts.length-2) {endCap=true} else {endCap=false}

      for (let j = m; j > 0; j--) {
        pathSegment(p1, p2, r, g*j, color[j-1], startCap, endCap)
      }
      turnCount += 1;
      lastDir = dir
    }
  }
}


function createNewPath() {
  usrPaths.push(usrPnts)
  usrPnts = []
  usrRotations.push(r)
}

function drawGrid(gridSize) {
  // Loop through the canvas width and height to create grid lines
  // let cols = width / gridSize;
  // let rows = height / gridSize;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      stroke('grey');
      strokeWeight(.25)
      noFill();
      rect(i * gridSize, j * gridSize, gridSize, gridSize); // Draw each grid cell
    }
  }
  }
  
// Define user mouse click action
function mousePressed() {
  // Check if the click is within grid bounds
  if (mouseX < 0 || mouseX >= cols * gridSize || mouseY < 0 || mouseY >= rows * gridSize) {
      return; // Exit the function if click is outside the grid
  }
  
  // Calculate which grid cell is clicked
  let col = floor(mouseX / gridSize);
  let row = floor(mouseY / gridSize);
  
  // Calculate center of the clicked grid cell
  let centerX = col * gridSize + gridSize / 2;
  let centerY = row * gridSize + gridSize / 2;
  usrPnts.push({ x: centerX, y: centerY });
  redraw()
  
  
  
}




