function pathSegment(p1, p2, rotation = 1, offset = 0, color = {r: 0, g: 0, b: 0}, debug = false) {
    
    let w = dist(p1.x, p1.y, p2.x, p2.y); // distance between p1 and p2, same as gridsize
    let dir = {x: Math.sign(p1.x-p2.x), y: Math.sign(p1.y-p2.y)} // vector of segment
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
    }

    pop()


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