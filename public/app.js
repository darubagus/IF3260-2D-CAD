// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';

import {createLineVertex,
    createLineColor} from './line.js';

import {createSquareVertex,
    createSquareColor} from './square.js';

import {choseButton,
    buttonClicked,
    convertMousePos} from './toolbar.js';


// Instantiate webgl
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Check if webgl not exist
if (!gl) {
    alert('WebGL not supported, please use a browser that support WebGL');
}

var allData = {};

// Resize canvas
var width = canvas.clientWidth;
var height = canvas.clientHeight;
if (canvas.width != width || canvas.height != height) {
    canvas.width = width;
    canvas.height = height;
}

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Get vertex shader and fragment shader source from html
let vertexShaderSource = document.getElementById('vertex-shader').text;
let fragmentShaderSource = document.getElementById('fragment-shader').text;

// // Create line vertex
// let vertex = createLineVertex(0, 0, 1, 1);

// // Create color of line (black)
// let color = createLineColor(0, 0, 0, 1);

// // Create vertex buffer
// let vertexBuffer = webglUtils.createBuffer(gl, vertex, allData);

// // Create color buffer
// let colorBuffer = webglUtils.createBuffer(gl, color, allData);


// Create square vertex
let squareVertex = createSquareVertex(0, 0, 1, 1);

// Create color of square (red)
let squareColor = createSquareColor(1, 0, 0, 1);

// Create square vertex buffer
let squareVertexBuffer = webglUtils.createBuffer(gl, squareVertex, allData);

// Create square color buffer
let squareColorBuffer = webglUtils.createBuffer(gl, squareColor, allData);


// Create vertex shader
let vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

// Create fragment shader
let fragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create program
let program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

// Enable vertex and color attributes
// webglUtils.enableAttribute(gl, program, vertexBuffer, 'a_position', 2, gl.FLOAT, false, 0, 0);
// webglUtils.enableAttribute(gl, program, colorBuffer, 'a_color', 4, gl.FLOAT, false, 0, 0);
webglUtils.enableAttribute(gl, program, squareVertexBuffer, 'a_position', 2, gl.FLOAT, false, 0, 0);
webglUtils.enableAttribute(gl, program, squareColorBuffer, 'a_color', 4, gl.FLOAT, false, 0, 0);

// Draw
webglUtils.drawArrays(gl, program, gl.LINES, 8);