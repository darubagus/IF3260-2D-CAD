// Function to create webgl vertex to create 2d square from 4 lines
function createSquareVertex(x1, y1, x2, y2) {
    // x1,y1 : start point
    // x2,y2 : end point
    let sideLength = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    let deltaX = sideLength;
    let deltaY = sideLength;
    if (x1 > x2) {
        deltaX = -deltaX;
    }
    if (y1 > y2) {
        deltaY = -deltaY;
    }

    // make square vertex from 4 line
    let vertex = new Float32Array([
        x1, y1,
        x1 + deltaX, y1,

        x1 + deltaX, y1,
        x1 + deltaX, y1 + deltaY,

        x1 + deltaX, y1 + deltaY,
        x1, y1 + deltaY,
        
        x1, y1 + deltaY,
        x1, y1,
    ]);

    return vertex;
}

// Function to create webgl color to create 2d square from 4 lines
function createSquareColor(r, g, b, a) {
    // r,g,b,a : color
    let color = new Float32Array([
        r, g, b, a,
        r, g, b, a,

        r, g, b, a,
        r, g, b, a,

        r, g, b, a,
        r, g, b, a,

        r, g, b, a,
        r, g, b, a,
    ]);

    return color;
}

export { createSquareVertex, createSquareColor };