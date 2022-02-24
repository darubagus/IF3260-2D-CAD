// Function for creating webgl shader
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    return shader;
}

// Function for creating webgl program
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    return program;
}

// Function for creating webgl buffer
function createBuffer(gl, data) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
}


// Function to enable webgl attribute
function enableAttribute(gl, program, buffer, attribute, size, type, normalize, stride, offset) {
    let location = gl.getAttribLocation(program, attribute);
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
}

// Function to use program and drawarrays
function drawArrays(gl, program, mode, count, offset) {
    gl.useProgram(program);
    gl.drawArrays(mode, offset, count);
}

// Export all to module.exports
export {
    createShader,
    createProgram,
    createBuffer,
    enableAttribute,
    drawArrays
};