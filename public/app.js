// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';

import {createLineVertex,
    createLineColor} from './line.js';

import {createHollowSquareVertex, createHollowSquareColor,
createSolidSquareVertex, createSolidSquareColor} from './square.js';

import {createHollowRectangleVertex, createHollowRectangleColor,} from './rectangle.js';

import {choseButton,
    buttonClicked,
    convertMousePos} from './toolbar.js';

import * as draw from './draw.js';
import { download } from './app-util.js';


// Instantiate webgl
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Check if webgl not exist
if (!gl) {
    alert('WebGL not supported, please use a browser that support WebGL');
}

var isDrawing = false;
var drawPivotPoint = {x : 0, y : 0};
var allData = [];

let loadFileInput = null;

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

// Iterate all toolbar button and add event listene to choseButton
for (let buttonId in buttonClicked) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', () => {
        choseButton(buttonId);
    });
}

// Add event listener to canvas on mouse down
canvas.addEventListener('mousedown', (evt) => {
    // Check if button is clicked for drawing
    if (buttonClicked['btn-line'] || buttonClicked['btn-square'] || buttonClicked['btn-rectangle'] || buttonClicked['btn-polygon']) {
        isDrawing = true;
        drawPivotPoint = convertMousePos(canvas, evt);
    }
});

// Add event listener to canvas on mouse up
canvas.addEventListener('mouseup', (evt) => {
    if (isDrawing) {
        isDrawing = false;
        if (allData.length > 0) {
            allData[allData.length - 1].fixed = true;
        }
    }
});

/**
 * Add event listener to saveButton
 */
document.getElementById('btn-save').addEventListener('click', () => {
    const fileContent = {
        createdAt: new Date(),
        data: allData
    }
    download(JSON.stringify(fileContent), 'data.json', 'application/json');
})

/**
 * Add event listener to loadButton
 */
document.getElementById('btn-load').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    const readFile = (e) => {
        const file = e.target.files[0];
        if (!file) {
            document.body.removeChild(loadFileInput);
            loadFileInput = null;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const data = JSON.parse(content);

            document.body.removeChild(loadFileInput);
            loadFileInput = null;

            allData = [];
            
            for (let i = 0; i < data['data'].length; i++) {
                let newData = {
                    vertex: new Float32Array(Object.values(data['data'][i].vertex)),
                    color: new Float32Array(Object.values(data['data'][i].color)),
                    vertexSize : data['data'][i].vertexSize,
                    colorSize : data['data'][i].colorSize,
                    start : data['data'][i].start,
                    count : data['data'][i].count,
                    fixed : data['data'][i].fixed,
                    primitive : data['data'][i].primitive
                }
                allData.push(newData);
            }

            draw.render(allData, program, gl);
        }
        reader.readAsText(file);
    }
    fileInput.onchange = readFile;
    document.body.appendChild(fileInput);
    loadFileInput = fileInput;
    fileInput.click();
})

// Add event listener to canvas onmousemove to draw
canvas.addEventListener('mousemove', (evt) => {
    if (isDrawing) {
        let mousePos = convertMousePos(canvas, evt);

        let vertex;
        let color;
        let type;

        // Pop allData if allData is not empty
        if (allData.length > 0) {
            if (!allData[allData.length - 1].fixed) {
                allData.pop();
            }
        }
        
        // Check which button is clicked
        if (buttonClicked['btn-line']) {
            vertex = createLineVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createLineColor(0,0,0,1);
            type = draw.LINE;
        }else if (buttonClicked['btn-square']) {
            vertex = createHollowSquareVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createHollowSquareColor(0,0,0,1);
            type = draw.HOLLOWSQUARE;
        }else if (buttonClicked['btn-rectangle']) {
            vertex = createHollowRectangleVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createHollowRectangleColor(0,0,0,1);
            type = draw.HOLLOWRECTANGLE;
        }

        // Append the vertex and color to allData
        draw.appendNewData(gl,allData,type,vertex,color);

        // render
        draw.render(allData,program,gl);
    }
});

/**
 * JSON to stringify allData
 */
