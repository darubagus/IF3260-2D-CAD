function createPolygonGuideLineVertex(xs,ys) {
    if (xs.length != ys.length) {
        throw new Error("xs and ys must be the same length");
    }
    let vertex = [];
    for (let i = 0; i < xs.length; i++) {
        vertex.push(xs[i]);
        vertex.push(ys[i]);
    }
    return new Float32Array(vertex);
}

function createPolygonGuideLineColor(n,r,g,b,a) {
    let color = [];
    for (let i = 0; i < n; i++) {
        color.push(r);
        color.push(g);
        color.push(b);
        color.push(a);
    }
    return new Float32Array(color);
}

export { createPolygonGuideLineVertex, createPolygonGuideLineColor };