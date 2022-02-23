// Get mouse position
function getRelativeMousePosition(event, target) {
  target = target || event.target;
  let rect = target.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Create and compile shader
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// get mouse position
function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
  target = target || event.target;
  let pos = getRelativeMousePosition(event, target);

  pos.x = (pos.x * target.width) / target.clientWidth;
  pos.y = (pos.y * target.height) / target.clientHeight;

  return pos;
}

// canvas to WebGL coordinate
function canvasPostoWebgl(pos) {
  // pos is in pixel coordinates for the canvas.
  // so convert to WebGL clip space coordinates
  pos.x = (pos.x / gl.canvas.width) * 2 - 1;
  pos.y = (pos.y / gl.canvas.height) * -2 + 1;

  return pos;
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

// define vertex shader
const vsSource = `
  attribute vec2 a_position;
  
  uniform vec2 u_resolution;

  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
  `;

// define fragment shader
const fsSource = `
  precision mediump float;
  
  uniform vec4 u_color;

  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
  `;

let position = [];
const STATE = "RECTANGLE";
let remainingVertices = 0;

if (STATE == "LINE") {
  remainingVertices = 2;
} else if (STATE == "RECTANGLE") {
  remainingVertices = 4;
}
let nShape = 0;

// get webgl context
const gl = document.querySelector("#gl-canvas").getContext("webgl");

if (!gl) {
  throw "Web is not compatible";
}

// create shader
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);

let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

let program = createProgram(gl, vertexShader, fragmentShader);

// get our position
var positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // do in inisitialization not render loop
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

function draw() {
  // let positionBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // let position = [0, 0, 0, 10];
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  // // Tell WEBGL TO TAKE DATA FROM THE BUFFER AND SUPPLY ATTR TO SHADER
  // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  // gl.enableVertexAttribArray(positionAttributeLocation);
  // // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  // var size = 2; // 2 components per iteration
  // var type = gl.FLOAT; // the data is 32bit floats
  // var normalize = false; // don't normalize the data
  // var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  // var offset = 0; // start at the beginning of the buffer
  // gl.vertexAttribPointer(
  //   positionAttributeLocation,
  //   size,
  //   type,
  //   normalize,
  //   stride,
  //   offset
  // );

  for (let i = 0; i < nShape; i++) {
    console.log(position.slice(i * 8, i * 8 + 8));
    let positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell WEBGL TO TAKE DATA FROM THE BUFFER AND SUPPLY ATTR TO SHADER
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.enableVertexAttribArray(positionAttributeLocation);
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(position.slice(i * 8, i * 8 + 8)),
      gl.STATIC_DRAW
    );

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 0;

    if (STATE == "LINE") {
      primitiveType = gl.LINES;
      count = 4;
    } else {
      primitiveType = gl.TRIANGLE_FAN;
      count = 4;
    }

    gl.drawArrays(primitiveType, 0, 4);
  }
}

const getMousePosCanvas = (canvas, evt) => {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

function drawPoints(){
  for (point in position){
    
  }
}

const canvas = document.querySelector("#gl-canvas");
canvas.addEventListener("click", (e) => {
  let pos = getMousePosCanvas(canvas, e);
  console.log(pos);

  position.push(pos.x);
  position.push(pos.y);
  remainingVertices -= 1;

  console.log(`Remaining vert : ${remainingVertices}`);
  console.log(position);

  if (remainingVertices == 0) {
    nShape += 1;

    draw();
    if (STATE == "LINE") {
      remainingVertices = 2;
    } else if (STATE == "RECTANGLE") {
      remainingVertices = 4;
    }
    console.log("Goes here");
  }
});
