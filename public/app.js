// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';
import {createLineVertex, createLineColor} from './line.js';
import {createSquareVertex, createSquareColor} from './square.js';
import {createRectangleColor, createRectangleVertex,} from './rectangle.js';
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

// Global variables
var isDrawing = false;
var isTransforming = false;
var drawPivotPoint = {x : 0, y : 0};
var allData = [];
var selectedShape = {}
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

// Add event listener to btn-clear to do gl.clear
let btnClear = document.getElementById('btn-clear');
btnClear.addEventListener('click', () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    allData = [];
});

// Add event listener to canvas on mouse down
canvas.addEventListener('mousedown', (evt) => {
    // Check if button is clicked for drawing
    if (buttonClicked['btn-line'] || buttonClicked['btn-square'] || buttonClicked['btn-rectangle'] || buttonClicked['btn-polygon']) {
        isDrawing = true;
        isTransforming = false;
        drawPivotPoint = convertMousePos(canvas, evt);
    } else if (buttonClicked['btn-mouse']) { // transforming state
        let nearestShape = getNearestShape(evt)

        // check if there is shape vertex around mouse pointer
        if (nearestShape.objId !== -1) {
            isTransforming = true;
            isDrawing = false;
            selectedShape = allData[nearestShape.objId];

            // delete selected shape from allData
            // console.log(selectedShape)
            allData.splice(nearestShape.objId, 1);

            // reset pivot
            drawPivotPoint.x = selectedShape.vertex[nearestShape.pivotId.x];
            drawPivotPoint.y = selectedShape.vertex[nearestShape.pivotId.y];
        }
    }
});

// Add event listener to canvas on mouse up
canvas.addEventListener('mouseup', (evt) => {
    if (isDrawing || isTransforming) {
        isDrawing = false;
        isTransforming = false;
        selectedShape = {};

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
                    primitive : data['data'][i].primitive,
                    type: data['data'][i].type,
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
    if (isDrawing || isTransforming) {
        let mousePos = convertMousePos(canvas, evt);

        let vertex;
        let color;
        let type;
        let isFill;

        // Pop allData if allData is not empty
        if (allData.length > 0) {
            if (!allData[allData.length - 1].fixed) {
                allData.pop();
            }
        }

        // solid state
        if (isTransforming){
            isFill = 
            selectedShape.type == draw.RECTANGLE || 
            selectedShape.type == draw.SQUARE
        } else {
            isFill = document.getElementById("check-fill").checked;
        }
        
        // Check which button is clicked
        if (buttonClicked['btn-line'] || selectedShape.type == draw.LINE) {
            vertex = createLineVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createLineColor(0,0,0,1);
            type = draw.LINE;
        } else if (buttonClicked['btn-square'] 
            || selectedShape.type == draw.SQUARE 
            || selectedShape.type == draw.HOLLOWSQUARE) {
            vertex = createSquareVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createSquareColor(0,0,0,1);
            
            // check if hollow or solid
            if (!isFill) {
                type = draw.HOLLOWSQUARE;
            } else {
                type = draw.SQUARE;
            }
        } else if (buttonClicked['btn-rectangle'] 
            || selectedShape.type == draw.RECTANGLE 
            || selectedShape.type == draw.HOLLOWRECTANGLE) {
            vertex = createRectangleVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createRectangleColor(0,0,0,1);

            // check if hollow or solid
            if (!isFill) {
                type = draw.HOLLOWRECTANGLE;
            } else {
                type = draw.RECTANGLE;
            }
        }

        // Append the vertex and color to allData
        draw.appendNewData(gl,allData,type,vertex,color);

        // render
        draw.render(allData,program,gl);
    }
});

/*
  Find nearest shape from mouse position
*/
const getNearestShape = (evt) => {
    // tolerable  error
    const error = 0.05;
  
    let smallestTemp = 999;
    let selectedObj = -1;
    // nearest point / vertex
    let selectedVert = {
      x: -1,
      y: -1,
    };
    // new pivot
    let pivotId = {};
    pivotId.x = -1;
    pivotId.y = -1;
  
    // search through newData array and get the object
    for (let i = 0; i < allData.length; i++) {
      let mousePos = convertMousePos(canvas, evt);
      // iterate through all vertex of a shape with index i
      for (let j = 0; j < allData[i].count; j++) {
        // calculate the distance between mouse position and vertex (x,y)
        let dist = Math.sqrt(
          Math.pow(mousePos.x - allData[i].vertex[j * 2], 2) +
            Math.pow(mousePos.y - allData[i].vertex[j * 2 + 1], 2)
        );

        if (dist < smallestTemp && dist < error) {
          smallestTemp = dist;
          selectedObj = i; // index of selected data of allData
          selectedVert = { x: j * 2, y: j * 2 + 1 }; // index of selected vertex of allData[].vertex
        }
      }
    }
  
    // check if exist shape near mouse pointer
    if (selectedObj !== -1) {
    //   document.getElementById("canvas").style.cursor = "nesw-resize";
        // set new pivot
        if (allData[selectedObj].type == "LINE") {
            if (selectedVert.x == 0) pivotId = { x: 2, y: 3 };
            else pivotId = { x: 0, y: 1 };
        } else {
            // rect or square
            for (let i = 0; i < allData[selectedObj].count; i++) {
                if(allData[selectedObj].vertex[i * 2] !== allData[selectedObj].vertex[selectedVert.x]  
                    && allData[selectedObj].vertex[i * 2 + 1] !== allData[selectedObj].vertex[selectedVert.y]) 
                    {
                        pivotId.x = i * 2;
                        pivotId.y = i * 2 + 1;
                        break;
                }
            }
        }
    }
  
    return {
      objId: selectedObj,
      position: selectedVert,
      pivotId,
    };
  };
  
/**
 * JSON to stringify allData
 */
