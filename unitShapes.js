function pathSegment(p1, p2, rotation = 1, offset = 0, color = {r: 0, g: 0, b: 0}, startCap = false, endCap = false, debug = false) {
    
    let w = dist(p1.x, p1.y, p2.x, p2.y); // distance between p1 and p2, typically same as gridsize
    let dir = {x: Math.sign(p1.x-p2.x), y: Math.sign(p1.y-p2.y)} // vector of segment from p1 to p2
    let mp = {x: (p1.x+p2.x)/2, y: (p1.y+p2.y)/2}; // midpoint between p1 and p2
    let dia = (Math.sqrt(2* Math.pow(w, 2))); 
    let dia_set = []
    let flip;   // flips the direction of the arc based on the arc's relative position on  
                // an imaginary circle
    if (dir.x == -1 || dir.y == -1) {flip = 1} else {flip = -1} 


    if (offset <= 2) {dia_set.push(dia)}
    else {dia_set.push(dia + offset/2); dia_set.push(dia - offset/2)}
    
    let shift = w/2
    
    let start;
    let stop;

    if (startCap){
        stroke(color.r, color.g, color.b)
        strokeWeight(2)
        fill('white')
        ellipse(p1.x, p1.y, offset/2)
        };
    if (endCap) {
        stroke(color.r, color.g, color.b)
        strokeWeight(2)
        fill('white')
        ellipse(p2.x, p2.y, offset/2)
    };

    if (Math.abs(dir.x) == Math.abs(dir.y)) { // if the segment is a diagonal
        push();
        translate(mp.x, mp.y);
        
        // Step 2: Determine the rotation angle in 45-degree increments
        let angle = atan2(dir.y, dir.x);
        console.log(angle)
        let angleInDegrees = round(degrees(angle) / 45) * 45;
        
        // Step 3: Rotate by the calculated angle
        rotate(radians(angleInDegrees));
        
        // Step 4: Draw the rectangle with no stroke and no fill
        fill('white');
        noStroke();
        rectMode(CENTER);
        rect(0, 0, w, offset/2);
        stroke(color.r, color.g, color.b);
        line(-w/2, offset/4, w/2, offset/4)
        line(-w/2, -offset/4, w/2, -offset/4)

        
        pop();

    }

    else { // if the segment is a horizontal or vertical line
        if (flip == -1) {start = 45} else {start = -135}
        stop = start + 90
    
        // rotate the arc according to it's direction and rotation
        push()
        translate(mp.x, mp.y)
        if (dir.y != 0) {rotate(rotation*90)} // rotates the imaginary circle 90
        if (rotation == -1) {rotate(dir.x*180)} // rotates the imaginary circle 180
        let cp = {x: 0, y: flip*shift} // centerpoint of arc and ellipse, flip if dir is -1
        strokeWeight(4)

        

        

        if (dia_set.length == 1) {noFill(); stroke('black'); arc(cp.x, cp.y, dia_set[0], dia_set[0], start, stop)}

        else {
            
            
            push()
            beginClip({invert: true});
            ellipse(cp.x, cp.y, dia_set[1], dia_set[1])
            endClip();

            noStroke()
            fill('white')
            // noFill()
            arc(cp.x, cp.y, dia_set[0], dia_set[0], start, stop, PIE)
            pop()

            noFill()
            stroke(color.r, color.g, color.b)
            strokeWeight(2)
            arc(cp.x, cp.y, dia_set[1], dia_set[1], start, stop)
            arc(cp.x, cp.y, dia_set[0], dia_set[0], start, stop)
            fill('white')

            
            
        }

        pop()

        strokeWeight(2)


        if (debug) {
            strokeWeight(1)
            rectMode(CENTER)
            rect(p1.x, p1.y, w, w);
            rect(p2.x, p2.y, w, w);
            points = [p1, p2, cp, mp]
            points.forEach(element => {
                ellipse(element.x, element.y, 5, 5);
            }); (point in points)
        };
        }

    
}

function cascadingCircle(p1, radius = 0, color = {r: 0, g: 0, b: 0}) {
    fill('white')
    stroke(color.r, color.g, color.b)
    ellipse(p1.x, p1.y, radius/2, radius/2)
}
