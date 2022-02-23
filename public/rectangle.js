// Function to create webgl vertex to create 2d hollow rectangle from 4 lines
function createHollowRectangleVertex(x1, y1, x2, y2) {
    // x1,y1 : start point
    // x2,y2 : end point

    // make rectangle vertex from 4 line
    let vertex = new Float32Array([
        x1, y1,
        x2, y1,
        x2, y2,
        x1, y2,
    ]);

    return vertex;
}

// Function to create webgl color to create 2d hollow rectangle from 4 lines
function createHollowRectangleColor(r, g, b, a) {
    // r,g,b,a : color
    let color = new Float32Array([
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
        r, g, b, a,
    ]);

    return color;

}

export { createHollowRectangleVertex, createHollowRectangleColor };