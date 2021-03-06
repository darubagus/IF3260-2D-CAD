// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';
import {createLineVertex, createLineColor} from './line.js';
import {createSquareVertex, createSquareColor} from './square.js';
import {createRectangleColor, createRectangleVertex,} from './rectangle.js';
import {choseButton,
    buttonClicked,
    convertMousePos,
    getColor} from './toolbar.js';
import * as draw from './draw.js';
import { download, findNearestPoint, findAnchorPoint } from './app-util.js';
import { createPolygonGuideLineVertex, createPolygonGuideLineColor } from './polygon.js';


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
var isMoving = false;
let polygonID = -1;
var drawPivotPoint = {x : 0, y : 0};
var allData = [];
var selectedShape = {}
let loadFileInput = null;
var colorPicker = getColor();
var pivotVertex = {};
var currentPolygon = {
    x : [],
    y : [],
    r : 0,
    g : 0,
    b : 0,
    isDrawing : false
};
let isTransformingPolygon = false;
let anchor = {}
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
let vertexPointShaderSource = document.getElementById('point-vertex-shader').text;
let fragmentPointShaderSource = document.getElementById('fragment-shader').text;

// Create vertex shader
let vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let pointVertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vertexPointShaderSource);
// Create fragment shader
let fragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
let pointFragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentPointShaderSource);

// Create program
let program = webglUtils.createProgram(gl, vertexShader, fragmentShader);
let progamPoint = webglUtils.createProgram(gl, pointVertexShader, pointFragmentShader);

// Iterate all toolbar button and add event listene to choseButton
for (let buttonId in buttonClicked) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', () => {
        choseButton(buttonId);
    });
}

// Change cursor type to corsshair when entering the canvas and back to default when leaving
canvas.addEventListener('mouseenter', () => {
    document.getElementById("canvas").style.cursor = "crosshair";
});
canvas.addEventListener('mouseleave', () => {
    canvas.style.cursor = 'default';
});



// Add event listener to color picker to change color value
document.getElementById('color-picker').addEventListener('change', () => {
    colorPicker = getColor();
});

// Add event listener to btn-clear to do gl.clear
let btnClear = document.getElementById('btn-clear');
btnClear.addEventListener('click', () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    allData = [];
});

// Add event listener to canvas on mouse down
canvas.addEventListener('mousedown', (evt) => {
    // Check if button is clicked for drawing
    if (buttonClicked['btn-line'] || buttonClicked['btn-square'] || buttonClicked['btn-rectangle']) {
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

            isTransformingPolygon = 
            (selectedShape.type == draw.POLYGON) || 
            (selectedShape.type == draw.HOLLOWPOLYGON);
            // delete selected shape from allData

            // reset pivo
            if (!isTransformingPolygon){
                allData.splice(nearestShape.objId, 1);
                drawPivotPoint.x = selectedShape.vertex[nearestShape.pivotId.x];
                drawPivotPoint.y = selectedShape.vertex[nearestShape.pivotId.y];
            } else {
                polygonID = nearestShape.objId;
                anchor = findAnchorPoint(selectedShape.vertex);

                pivotVertex.x = nearestShape.selectedPoint.x;
                pivotVertex.y = nearestShape.selectedPoint.y;
            }
        }
    } else if (buttonClicked['btn-move']){
        // get shape index
        let objId = moveObject(evt).objId
        if (objId !== -1){
            isMoving = true;
            isTransforming = false;
            isDrawing = false;

            selectedShape.objId = objId;
            allData[objId].fixed = false;
        }
    }
});

// Add event listener to canvas on mouse up
canvas.addEventListener('mouseup', (evt) => {
    if (!buttonClicked['btn-polygon']) {
        if (isDrawing || isTransforming && !isTransformingPolygon) {
            isDrawing = false;
            isTransforming = false;
            selectedShape = {};

            if (allData.length > 0) {
                allData[allData.length - 1].fixed = true;
            }
        } else if (isMoving){
            isMoving = false;
            if (allData.length > 0) allData[selectedShape.objId].fixed = true;
            selectedShape = {};
        } else if (isTransformingPolygon) {
            isTransformingPolygon = false;
            isTransforming = false;
            anchor = {};
            selectedShape = {};
            pivotVertex = {};
            polygonID = -1;
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
        if (allData.length > 0 && !isTransformingPolygon) {
            if (!allData[allData.length - 1].fixed) {
                allData.pop();
            }
        }

        // solid state
        if (isTransforming){
            isFill = 
            selectedShape.type == draw.RECTANGLE || 
            selectedShape.type == draw.SQUARE ||
            selectedShape.type == draw.POLYGON
        } else {
            isFill = document.getElementById("check-fill").checked;
        }
        
        // Check which button is clicked
        if (buttonClicked['btn-line'] || selectedShape.type == draw.LINE) {
            vertex = createLineVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createLineColor(colorPicker.r,colorPicker.g,colorPicker.b,1);
            type = draw.LINE;
        } else if (buttonClicked['btn-square'] 
            || selectedShape.type == draw.SQUARE 
            || selectedShape.type == draw.HOLLOWSQUARE) {
            vertex = createSquareVertex(drawPivotPoint.x, drawPivotPoint.y, mousePos.x, mousePos.y);
            color = createSquareColor(colorPicker.r,colorPicker.g,colorPicker.b,1);
            
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
            color = createRectangleColor(colorPicker.r,colorPicker.g,colorPicker.b,1);

            // check if hollow or solid
            if (!isFill) {
                type = draw.HOLLOWRECTANGLE;
            } else {
                type = draw.RECTANGLE;
            }
        } else if (buttonClicked['btn-polygon']) {
            if (currentPolygon.isDrawing) {
                currentPolygon.x.push(mousePos.x);
                currentPolygon.y.push(mousePos.y);
                vertex = createPolygonGuideLineVertex(currentPolygon.x, currentPolygon.y);
                color = createPolygonGuideLineColor(currentPolygon.x.length,currentPolygon.r,currentPolygon.g,currentPolygon.b,1);
                currentPolygon.x.pop();
                currentPolygon.y.pop();
                type = draw.POLYGON_GUIDELINE;
            }
        } else if (isTransformingPolygon) {
            let newPos = convertMousePos(canvas, evt);

            // find nearest point from mouse position in line with vertex
            let maskedVertex = selectedShape.vertex;
            for (let i = 0; i < selectedShape.count; i++){
                maskedVertex[i*2] -= anchor.x;
                maskedVertex[i*2 + 1] -= anchor.y;
            }
            // masked the pivot
            let maskedPivotX = pivotVertex.x - anchor.x;
            let maskedPivotY = pivotVertex.y - anchor.y;

            // set new pivot
            pivotVertex.x = newPos.x;
            pivotVertex.y = newPos.y;

            // masked mouse position
            let maskedMouseX = mousePos.x - anchor.x;
            let maskedMouseY = mousePos.y - anchor.y;
            let scale = 1;

            // find slope
            if (maskedPivotX != 0 && maskedPivotY != 0){
                let slope = 1.000*maskedPivotY/maskedPivotX
                let xCross = (-maskedMouseX - slope*maskedMouseY)/(1 + Math.pow(slope, 2));
                scale = xCross / maskedPivotX;
            } else if (maskedPivotX == 0 && maskedPivotY == 0) {
                scale = 1;
            } else if (maskedPivotX == 0) {
                scale = maskedMouseY / maskedPivotY;
            } else if (maskedPivotY == 0) {
                scale = maskedMouseX / maskedPivotX;
            }

            if (scale == 0) scale = 1; // in case scalenya malah 0 
            scale = Math.abs(scale); // make it positive

            // update all vertex
            for (let i = 0; i < selectedShape.count; i++){
                maskedVertex[i*2] = maskedVertex[i*2] * scale + anchor.x;
                maskedVertex[i*2 + 1] = maskedVertex[i*2 + 1] * scale + anchor.y;
            }

            // change vertex
            allData[polygonID].vertex = maskedVertex;
        }

        // if transforming then don't use color picker
        if (isTransforming) color = selectedShape.color;            
        // Append the vertex and color to allData
        if (!isTransformingPolygon) {
            draw.appendNewData(gl,allData,type,vertex,color);
        }

        // render
        draw.render(allData,program,gl);
    
        if (isTransforming) {
            if (!isTransformingPolygon){
                draw.renderPoint(allData[allData.length - 1].vertex, progamPoint, gl);
            } else {
                draw.renderPoint(allData[polygonID].vertex, progamPoint, gl);
            }
        }
    } else if (isMoving){
        let newPos = convertMousePos(canvas, evt);
        let deltaX = newPos.x - pivotVertex.x;
        let deltaY = newPos.y - pivotVertex.y;

        // update origin
        pivotVertex.x = newPos.x;
        pivotVertex.y = newPos.y;
        
        // update vertex
        let vertex = allData[selectedShape.objId].vertex;

        for (let i = 0; i < allData[selectedShape.objId].count; i++){
            vertex[i*2] += deltaX; 
            vertex[i*2 + 1] += deltaY
        }

        allData[selectedShape.objId].vertex = vertex;
        
        // render
        draw.render(allData,program,gl);

        draw.renderPoint(allData[selectedShape.objId].vertex, progamPoint, gl);
    }
});

// Polygon guideline
canvas.addEventListener('click', (evt) => {
    // Check if is drawing and the button clicked is polygon
    if (buttonClicked['btn-polygon']) {
        if (!isDrawing) {
            isDrawing = true;
        }
        // check if current polygon is drawn or not
        if (!currentPolygon.isDrawing) {
            currentPolygon.r = colorPicker.r;
            currentPolygon.g = colorPicker.g;
            currentPolygon.b = colorPicker.b;
            currentPolygon.isDrawing = true;
        } else {
            allData.pop();
        }
        
        let mousePos = convertMousePos(canvas, evt);
        currentPolygon.x.push(mousePos.x);
        currentPolygon.y.push(mousePos.y);
        // create the vertex and the color data
        let vertex = createPolygonGuideLineVertex(currentPolygon.x, currentPolygon.y);
        let color = createPolygonGuideLineColor(currentPolygon.x.length,currentPolygon.r, currentPolygon.g, currentPolygon.b, 1);
        
        // append the vertex and color data to allData
        draw.appendNewData(gl,allData,draw.POLYGON_GUIDELINE,vertex,color);
    }
});

window.addEventListener('keydown', (evt) => {
    if (evt.code !== 'Space') {
        return;
    }
    if (buttonClicked['btn-polygon']) {
        if (isDrawing) {
            isDrawing = false;
        }

        if (currentPolygon.isDrawing) {
            let isFill = document.getElementById("check-fill").checked;
            currentPolygon.isDrawing = false;
            allData.pop();

            // create the vertex and the color data
            let vertex = createPolygonGuideLineVertex(currentPolygon.x, currentPolygon.y);
            let color = createPolygonGuideLineColor(currentPolygon.x.length,currentPolygon.r, currentPolygon.g, currentPolygon.b, 1);

            let type = draw.HOLLOWPOLYGON;
            if (isFill) {
                type = draw.POLYGON;
            }
            // append the vertex and color data to allData
            draw.appendNewData(gl,allData,type,vertex,color);

            // set the last element of alldata fixed become true
            allData[allData.length - 1].fixed = true;

            // render
            draw.render(allData,program,gl);

            // set back currentPolygon to default
            currentPolygon.x = [];
            currentPolygon.y = [];
            currentPolygon.r = 0;
            currentPolygon.g = 0;
            currentPolygon.b = 0;
        }
    }
});

/*
  Find nearest shape from mouse position
*/
const getNearestShape = (evt) => {
    // tolerable  error
    const error = 0.05;
    let objColor;

    // new pivot
    let pivotId = {};
    pivotId.x = -1;
    pivotId.y = -1;
  
    let mousePos = convertMousePos(canvas, evt);

    let {selectedObj, selectedVert} = findNearestPoint(mousePos, error, allData)
    let vertex;
    let selectedPoint;

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
        vertex = allData[selectedObj].vertex;
        selectedPoint = {
            x: allData[selectedObj].vertex[selectedVert.x],
            y: allData[selectedObj].vertex[selectedVert.y]
        }
    }
  
    return {
        objId: selectedObj,
        position: selectedVert,
        pivotId,
        objColor,
        vertex,
        selectedPoint
    };
};
  
/*
    Function to find the pivot point for moving object
*/
const moveObject = (evt) => {
    let nearestShape = getNearestShape(evt);

    if (nearestShape.objId !== -1) {
        // set origin for translation
        pivotVertex.x = nearestShape.selectedPoint.x;
        pivotVertex.y = nearestShape.selectedPoint.y;
    }

    return {
        objId: nearestShape.objId
    }
}