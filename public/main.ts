import {Drawables} from './interfaces';

// Initial Declaration
var mousePosition: [number, number] = [0, 0];
var isLine = false;
var isSquare = false;
var isRectangle = false;
var isPolygon = false;

// num of points
const ObjProps = {
  numOfPoints: 0,
  vertices: [],
  rgb: [0.0, 0.0, 0.0],
  currPoints: [],
  // eslint-disable-next-line no-array-constructor
  arrObjects: new Array<Drawables>(),
};

// selection and moving
var SelectedObject: number;
var idxPoint: number;
var isDrag: boolean = false;

/**
 * Set draw type to Line
 */
function setLine() {
  isLine = true;
  isSquare = false;
  isRectangle = false;
  isPolygon = false;
}

/**
 * Set draw type to Square
 */
function setSquare() {
  isLine = false;
  isSquare = true;
  isRectangle = false;
  isPolygon = false;
}

/**
 * Set draw type to Rectangle
 */
function setRectangle() {
  isLine = false;
  isSquare = false;
  isRectangle = true;
  isPolygon = false;
}

/**
 * Set draw type to Polygon
 */
function setPolygon() {
  isLine = false;
  isSquare = false;
  isRectangle = false;
  isPolygon = true;
}

/**
 * Clear draw type
 */
function setClear() {
  isLine = false;
  isSquare = false;
  isRectangle = false;
  isPolygon = false;
}

/**
  * Set drawing state
  */
function setUI() {
  // eslint-disable-next-line max-len
  const drawLineButton = document.getElementById('drawLine') as HTMLButtonElement;
  // eslint-disable-next-line max-len
  const drawSquareButton = document.getElementById('drawSquare') as HTMLButtonElement;
  // eslint-disable-next-line max-len
  const drawRectangleButton = document.getElementById('drawRectangle') as HTMLButtonElement;
  // eslint-disable-next-line max-len
  const drawPolygonButton = document.getElementById('drawPolygon') as HTMLButtonElement;

  drawLineButton.addEventListener('click', () => {
    setLine();
  });

  drawSquareButton.addEventListener('click', () => {
    setSquare();
  });

  drawRectangleButton.addEventListener('click', () => {
    setRectangle();
  });

  drawPolygonButton.addEventListener('click', () => {
    setPolygon();
  });
}

function drawObject(gl: WebGL2RenderingContext, programi: WebGLProgram, vertices: any, method: any, n: number) {
  var vertexBufferObj = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObj);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

}
