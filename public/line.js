// Function to create vertex of line in 2d
function createLineVertex(x1, y1, x2, y2) {
    let vertex = new Float32Array([
        x1, y1,
        x2, y2
    ]);

    return vertex;
}

// Function to create color of line in 2d
function createLineColor(r, g, b, a) {
    let color = new Float32Array([
        r, g, b, a,
        r, g, b, a
    ]);

    return color;
}


export {
    createLineVertex,
    createLineColor
};