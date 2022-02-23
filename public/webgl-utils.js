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
function createBuffer(gl, data, allData) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Get buffer size using getBufferParameter
    const bufferSize = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
    // Add data with the offset to allData
    allData[bufferSize] = data;

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
function drawArrays(gl, program, mode, count) {
    gl.useProgram(program);
    gl.drawArrays(mode, 0, count);
}

// Export all to module.exports
export {
    createShader,
    createProgram,
    createBuffer,
    enableAttribute,
    drawArrays
};