// Function to create webgl vertex to create 2d rectangle from 4 lines
function createRectangleVertex(x1, y1, x2, y2) {
    // x1,y1 : start point
    // x2,y2 : end point

    // make rectangle vertex from 4 line
    let vertex = new Float32Array([
        x1, y1,
        x2, y1,

        x2, y1,
        x2, y2,

        x2, y2,
        x1, y2,
        
        x1, y2,
        x1, y1,
    ]);

    return vertex;
}