// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';

import {createLineVertex,
    createLineColor} from './line.js';

import {createHollowSquareVertex,
    createHollowSquareColor} from './square.js';

import {createHollowRectangleVertex,
    createHollowRectangleColor} from './rectangle.js';

import {choseButton,
    buttonClicked,
    convertMousePos} from './toolbar.js';

import * as draw from './draw.js';


// Instantiate webgl
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Check if webgl not exist
if (!gl) {
    alert('WebGL not supported, please use a browser that support WebGL');
}

var allVertexData = [];
var allColorData = [];
var allData = [];
var currentBufferOffset = { value : 0 };

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

// Create vertex shader
let vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

// Create fragment shader
let fragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create program
let program = webglUtils.createProgram(gl, vertexShader, fragmentShader);


// Create a line vertex data and color data
let lineVertexData = createLineVertex(0, 0, 0.2, 0.2);
let lineColorData = createLineColor(0, 0, 0, 1);

// Append line vertex and color data to all data
draw.appendNewData(gl,allData, draw.LINE, lineVertexData, lineColorData);

// Create hollow square vertex data and color data
let hollowSquareVertexData = createHollowSquareVertex(0, 0, 0.2, 0.2);
let hollowSquareColorData = createHollowSquareColor(0, 0, 0, 1);

// Append hollow square vertex and color data to all data
draw.appendNewData(gl,allData, draw.HOLLOWSQUARE, hollowSquareVertexData, hollowSquareColorData);

draw.render(allData,program,gl);