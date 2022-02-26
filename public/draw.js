// Import line.js webgl-utils.js toolbar.js
import * as webglUtils from './webgl-utils.js';

const LINE = 'LINE';
const HOLLOWSQUARE = 'HOLLOWSQUARE';
const HOLLOWRECTANGLE = 'HOLLOWRECTANGLE';
const RECTANGLE = 'RECTANGLE';
const SQUARE = 'SQUARE';

const appendNewData = (gl,allData,type,vertex,color) => {
    let start = 0;

    if (allData.length > 0) {
        start = allData[allData.length - 1].offset + allData[allData.length - 1].count;
    }

    let newData = {
        vertex : vertex,
        color : color,
        vertexSize : 2,
        colorSize : 4,
        start : 0,
        count : vertex.length / 2,
        fixed : false,
        type: type
    };

    if (type === LINE) {
        newData.primitive = gl.LINES;
    } else if (type === HOLLOWSQUARE || type === HOLLOWRECTANGLE) {
        newData.primitive = gl.LINE_LOOP;
    } else if (type === RECTANGLE || type === SQUARE) {
        newData.primitive = gl.TRIANGLE_FAN;
    }



    allData.push(newData);
}


const render = (allData,program,gl) => {
    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < allData.length; i++) {
        // Assign vertex and color from data
        let vertex = allData[i].vertex;
        let color = allData[i].color;
        let primitive = allData[i].primitive;
        let vertexSize = allData[i].vertexSize;
        let colorSize = allData[i].colorSize;
        let count = allData[i].count;
        let start = allData[i].start;

        // Create vertex and color buffer
        let vertexBuffer = webglUtils.createBuffer(gl,vertex);
        let colorBuffer = webglUtils.createBuffer(gl,color);

        // Enable vertex and color attribute
        webglUtils.enableAttribute(gl,program,vertexBuffer,'a_position',vertexSize,gl.FLOAT,false,0,0);
        webglUtils.enableAttribute(gl,program,colorBuffer,'a_color',colorSize,gl.FLOAT,false,0,0);

        // Draw
        webglUtils.drawArrays(gl,program,primitive,count,start);
    }
    
}

const renderPoint = (vertexArray,program,gl) => {
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Create vertex and color buffer
    let vertexBuffer = webglUtils.createBuffer(gl,vertexArray);

    // Enable vertex and color attribute
    webglUtils.enableAttribute(gl,program,vertexBuffer,'a_position',2,gl.FLOAT,false,0,0);
    // Draws
    console.log(vertexArray.length);
    webglUtils.drawArrays(gl,program, gl.POINTS, vertexArray.length/2, 0);
}

export {render, renderPoint, appendNewData, LINE, HOLLOWSQUARE, HOLLOWRECTANGLE, RECTANGLE, SQUARE};