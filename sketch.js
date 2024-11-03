let degreeSlider;
let offsetsSlider;
let usrPnts = []


function setup() {
  createCanvas(600, 800)
  frameRate (10)
  angleMode(DEGREES)
  normalAngle = 45
  noLoop();

  // Create column of Sliders
  group = createDiv('')
  group.position(10, 10)
  degreeSlider = createSlider(0, 100, 80, 0.0125);
  degreeSlider.input(() => {
    redraw()
  })
  degreeSlider.parent(group)
  degreeSlider.position(10, 20);
  degreeSlider.size(150);
  degreeLabel = createSpan('Degree: ', degreeSlider.value())
  degreeLabel.parent(group)

  //  Multiple offset slider
  offsetsSlider = createSlider(1, 15, 1, 1)
  offsetsSlider.position(10, 50)
  offsetsSlider.input(() => {
    redraw()
  })
  offsetsLabel = createSpan('Offsets: ')
  offsetsLabel.parent(group)
  


  // Parameters to set grid
  gridSize = 90;
  cols = width / gridSize;
  rows = height / gridSize;
  // usrPnts = [];



}

function draw() {
  // Draw the background
  background("black")
  // Draw the canvas Boundary
  fill('white')
  quad(0, 0, width, 0, width, height, 0, height)
  // Draw a grid of gridSize 
  drawGrid()



  strokeWeight(3)

  var g = degreeSlider.value();
  var m = offsetsSlider.value()

  
  noFill()


  let r = 1;
  let rHistory = [];
  let lastDir = {x: 0, y: 0};
  let turnCount = 1
  let turnHistory = []
  
  let color = []
  for (let i = 0; i < m; i++) {color.push({r: random(255), g: random(255), b: random(255)})}
  if (usrPnts.length > 1) {
    for (let i = 0; i < usrPnts.length -1; i++) {
      let p1 = usrPnts[i];
      let p2 = usrPnts[i+1];
      let dir = {x: Math.sign(p1.x - p2.x), y: Math.sign(p1.y - p2.y)}
      console.clear()
      if (lastDir.x == dir.x && lastDir.y == dir.y ) {r *= -1; turnCount = 1}
      // if (turnCount == 3 ) {r *= -1; turnCount = 1}
      turnHistory.push(turnCount); rHistory.push(r)
      console.log(lastDir, dir, "Rotation: ", r, "Number of Segments: ", turnCount)
      console.log("turn history: ", turnHistory); 
      console.log("rotation history: ", rHistory)

  
      for (let i = m; i > 0; i--) {
        pathSegment(p1, p2, r, g*i, color[i-1])
      }
      turnCount += 1;
      lastDir = dir
    }
  }
}

// HELPER FUNCTIONS BELOW HERE

function arcShapes(points, offset, num) {
  for (let i = 0; i < num; i++) {
    let factor = offset * (i + 1)
    let ct1 = (gridSize/2) * factor
    let ct2 = (gridSize/2) * -factor
    let dia1 = (Math.sqrt(2* Math.pow(gridSize, 2))) * factor
    let dia2 = (Math.sqrt(2* Math.pow(gridSize, 2))) * -factor
    let points_inflated = points.map(p => ({ x: p.x * factor, y: p.y * factor }));
    let points_deflated = points.map(p => ({ x: p.x / factor, y: p.y * -factor }));
    
    arcPath(points_inflated, ct=ct1, dia=dia1)
    arcPath(points_deflated, ct2, dia2)

  }
}

function arcPath(points, offset = 1) {

  let ct = (gridSize/2);
  let dia = Math.sqrt(2* Math.pow(gridSize, 2));
  let lastDir = {r: 1, x: 0, y: 0}

  first_point = {};
  last_point = {};


  if (points.length > 1) {
    for (let i = 0; i < points.length -1; i++) {
      let p1 = points[i];
      let p2 = points[i+1];
      let dir = {x: Math.sign(p1.x - p2.x), y: Math.sign(p1.y - p2.y)} // (+-1, 0) is left or right, (0, +-1) is up or down
      if (lastDir.x == dir.x && lastDir.y == dir.y) {lastDir.r *= -1}
      let cp = {}

      if (dir.x == 0) { // path traveling along y axis
        cp.y = (p1.y+p2.y)/2; 
        cp.x = p1.x + (lastDir.r * ct * dir.y)
        if (i == 0) {start = dir.y == 1 ? 325 : 125; arc(p1.x, p1.y, offset, offset, start, start + 180)}
        if (i == points.length-2) {start = lastDir.r == 1 ? 45 : -45; arc(p2.x, p2.y, offset, offset, start, start + 180)}

        lastDir.x = dir.x; lastDir.y = dir.y

        
      }

      else if (dir.y == 0) { 
        cp.x = (p1.x+p2.x)/2; 
        cp.y = p1.y - (lastDir.r * ct * dir.x)

        if (i == 0) {start = dir.x == -1 ? 45 : 235; arc(p1.x, p1.y, offset, offset, start, start + 180)}
        if (i == points.length-2) {start = lastDir.r == 1 ? -45 : 225; arc(p2.x, p2.y, offset, offset, start, start + 180)}
        lastDir.y = dir.y; lastDir.x = dir.x
        // cap the end if it's an end
        
      }

      
      [start, stop, v1, v2] = findAngles(cp, p1, p2)

      if (dir.y != 0 && dir.x != 0) {

        [offsetX, offsetY] = offsetLine(p1, p2, offset/2)

        line(p1.x + offsetX, p1.y + offsetY, p2.x + offsetX, p2.y + offsetY); 
        line(p1.x - offsetX, p1.y - offsetY, p2.x - offsetX, p2.y - offsetY);
        if (i == 0) {start = dir.x == -1 ? 45 : 235; arc(p1.x, p1.y, offset, offset, start, start + 180)}
        if (i == points.length-2) {start = dir.x == -1 ? -45 : 45; arc(p2.x, p2.y, offset, offset, start, start + 180)}

        continue
      }



      arc(cp.x, cp.y, dia + offset, dia + offset, start, stop) // (cx, cy, w, h, start, end)
      arc(cp.x, cp.y, dia - offset, dia - offset, start, stop) // (cx, cy, w, h, start, end)

      
      

    }
  }
}

function offsetLine(p1, p2, distance) {

  // Calculate the direction vector of the line
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;

  // Calculate the length of the line
  let length = Math.sqrt(dx * dx + dy * dy);

  // Normalize the direction vector and find the perpendicular vector
  let offsetX = -dy / length * distance;
  let offsetY = dx / length * distance;

  // Calculate the offset points
  let offsetPoint1 = { x: p1.x + offsetX, y: p1.y + offsetY };
  let offsetPoint2 = { x: p2.x + offsetX, y: p2.y + offsetY };

  return [offsetX, offsetY]
}

function scalePoint(point, centerPoint, factor) {

  let p1 = point
  let cp = centerPoint
  let f = factor

  mp = {x: (p1.x + cp.x)/2, y: (p1.y + cp.y)/2}

  let [start, stop, v1, v2] = findAngles(cp, p1, p2)

  // find vector lengths
  let v1_mag = Math.sqrt(Math.pow(v1.x, 2)+ Math.pow(v1.y, 2))

  // normalize the vectors
  let v1_dir = { x: v1.x / v1_mag, y: v1.y / v1_mag };

  // scale the vectors
  vo1 = { x: v1_dir.x * f, y: v1_dir.y * f }

  // scale the points
  let p1_offset = { x: p1.x + vo1.x, y: p1.y + vo1.y };

  return p1_offset
}

function findAngles(cp, p1, p2) {
  let gv = createVector(1, 0); // Reference vector along the x-axis
  let v1 = createVector(p1.x - cp.x, p1.y - cp.y);
  let v2 = createVector(p2.x - cp.x, p2.y - cp.y);
  
  // Calculate angle for v1
  let dot1 = gv.x * v1.x + gv.y * v1.y;
  let det1 = gv.x * v1.y - gv.y * v1.x;
  let angle1 = degrees(Math.atan2(det1, dot1)); // Angle in degrees
  if (angle1 < 0) angle1 += 360;

  // Calculate angle for v2
  let dot2 = gv.x * v2.x + gv.y * v2.y;
  let det2 = gv.x * v2.y - gv.y * v2.x;
  let angle2 = degrees(Math.atan2(det2, dot2)); // Angle in degrees
  if (angle2 < 0) angle2 += 360;

  // Sort the angles to ensure clockwise ordering
  let start = min(angle1, angle2);
  let stop = max(angle1, angle2);

  // Check if we need to wrap around 360 for clockwise continuity
  if (stop - start > 180) {
    [start, stop] = [stop, start + 360];
  }

  return [start, stop, v1, v2];
}

function basicArch(points, degree, offset) {
  let pnts = points
  let d = degree
  let direction = 1
  let o = offset
  let pathPnts = [points[0]]

  if (pnts.length > 1) {
    for (let i = 0; i < pnts.length - 1; i++) {
      let p1 = pnts[i];
      let p2 = pnts[i + 1];
      let center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      let [c, v] = pntDistance(p1, p2);
      let c1 = { x: center.x + (direction * v.y * d), y: center.y + (direction * v.x * d) };

      pathPnts.push(p2, c1)


  
      // Normalize vector `v` to get a unit vector in the direction from p1 to p2
      let mag = Math.sqrt(v.x * v.x + v.y * v.y);
      let offsetVector = { x: v.y / mag, y: v.x / mag }; // Perpendicular vector for offset
  
      // Use the offset vector to create mirrored points `n1` and `n2`
      let n1 = { x: p1.x + offsetVector.x * o, y: p1.y - offsetVector.y * o };
      let n2 = { x: p2.x + offsetVector.x * o, y: p2.y - offsetVector.y * o };
      let nc = { x: c1.x + offsetVector.x * o, y: c1.y - offsetVector.y * o };
  
      // Optionally adjust direction for symmetry (only if needed)
      if (Math.abs(v.x) / Math.abs(v.y) !== 1) {
        direction *= -1;
      }
  
      // Draw original path with quadratic vertex
      noFill();
      stroke('black');
      beginShape();
      vertex(p1.x, p1.y);
      quadraticVertex(c1.x, c1.y, p2.x, p2.y);
      endShape();

      // Draw offset path
      noFill();
      stroke('black');
      beginShape();
      vertex(n1.x, n1.y);
      quadraticVertex(nc.x, nc.y, n2.x, n2.y);
      endShape();
    }
  }
  
    

}

function pntDistance(p1, p2) {
  let a = p1.x - p2.x;
  let b = p1.y - p2.y;
  let c = Math.sqrt((a*a) + (b*b))
  let v = {x: -1 * a, y: -1 * b}
  return [c, v]
}



// Draw a user grid that is used for defining the drawing parameters

function drawGrid() {
  // Loop through the canvas width and height to create grid lines
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

function drawLines(degree, points, args = '') {
  stroke(0);
  noFill();
  let lastNormal = 1;
  
  if (points.length > 1) {
    beginShape();
    vertex(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      let p1 = points[i];
      let p2 = points[i + 1];
      let cx = (p1.x + p2.x) / 2;
      let cy = (p1.y + p2.y) / 2;

      // Adjust normal for corners using cross product
      if (i > 0 && i < points.length - 1) {
        let p0 = points[i - 1];
        let p3 = points[i + 1];
        
        let v1x = p1.x - p0.x, v1y = p1.y - p0.y;
        let v2x = p3.x - p2.x, v2y = p3.y - p2.y;
        
        let crossProduct = v1x * v2y - v1y * v2x;
        lastNormal = crossProduct > 0 ? 1 : -1;
      }

      let controlPointX, controlPointY;

      if (Math.abs(p2.x - p1.x) < 1e-6) { // Vertical segment
        controlPointX = cx + lastNormal * degree * (p2.y - p1.y);
        controlPointY = cy;
      } else if (Math.abs(p2.y - p1.y) < 1e-6) { // Horizontal segment
        controlPointX = cx;
        controlPointY = cy + lastNormal * degree * (p1.x - p2.x);
      } else { // Diagonal segment
        controlPointX = cx + lastNormal * (p2.y - p1.y) * degree;
        controlPointY = cy + lastNormal * (p1.x - p2.x) * degree;
      }

      quadraticVertex(controlPointX, controlPointY, p2.x, p2.y);
    }
    endShape(args);
  }
}

function drawShapes(degree, offsets) {
  stroke(0);
  // fill(200, 100, 100, 150);  // Semi-transparent fill for the closed shape
  distance = 20
  offsetDistance = [distance, -1 * distance]
  for (let dist of offsetDistance) {
    let offsetPoints = [];
    if (usrPnts.length > 1) {
      for (let i = 0; i < usrPnts.length - 1; i++) {
        let p1 = usrPnts[i];
        let p2 = usrPnts[i + 1];
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;

        // Calculate perpendicular unit vector for the normal
        let length = Math.sqrt(dx * dx + dy * dy);
        let normalX = -dy / length;
        let normalY = dx / length;

        // Calculate offset points for p1 and p2
        let offsetP1 = {
          x: p1.x + normalX * dist,
          y: p1.y + normalY * dist,
        };
        let offsetP2 = {
          x: p2.x + normalX * dist,
          y: p2.y + normalY * dist,
        };

        offsetPoints.push(offsetP1);
        if (i === usrPnts.length - 2) {
          offsetPoints.push(offsetP2); // Add the final offset point for the end of the path
        }
      }
    }
    drawLines(degree=degree, points=offsetPoints, args='CLOSED')
  }
}


function isEven(number) {
  return number % 2 === 0;
}

function roundedPolyline(points, radius) {
  if (points.length > 1) {
    for (let i = 0; i < points.length -1; i++) {
      x1 = points[i][0]
      y1 = points[i][1]
      x2 = points[i+1][0]
      y2 = points[i+1][1]

      line(x1, y1, x2, y2)
    }
    beginShape(POINTS);

    points.forEach(pt => {
      vertex(pt[0],pt[1])
    })
    endShape(CLOSE)

    for (let i = 0; i < points.length -1; i++) {
      if (i == 0 || i == points.length - 2)
      x1 = points[i][0]
      y1 = points[i][1]
      x2 = points[i+1][0]
      y2 = points[i+1][1]
      x3 = points[i+2][0]
      y3 = points[i+2][1]

      line(x1, y1, x2, y2);
      line(x2, y2, x3, y3) 
    
    

    }
  }
}

function randomPoints(numPoints, stepSize) {
  let points = [[width / 2, height / 2]];  // Start in the center

  // Directions: [signX, dy]
  const directions = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
    upLeft: [-1, -1],
    upRight: [1, -1],
    downLeft: [-1, 1],
    downRight: [1, 1]
  };

  let lastDirection = null;

  for (let i = 0; i < numPoints; i++) {
    // Randomly choose a direction, avoiding the reverse of the last direction
    let availableDirections = Object.keys(directions).filter(dir => {
      return !(lastDirection && (lastDirection === dir || lastDirection === getOppositeDirection(dir)));
    });
    
    let randomDir = random(availableDirections);
    let [signX, dy] = directions[randomDir];
    
    // Calculate the new point
    let lastPoint = points[points.length - 1];
    
    // Determine distance
    let newPoint = [lastPoint[0] + signX * stepSize, lastPoint[1] + dy * stepSize];
    
    points.push(newPoint);
    lastDirection = randomDir;  // Update the last direction
  }


  

  // console.log(points);
  return points
}

// Helper function to get the opposite direction
function getOppositeDirection(direction) {
  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
    upLeft: 'downRight',
    upRight: 'downLeft',
    downLeft: 'upRight',
    downRight: 'upLeft'
  };
  return opposites[direction];
}