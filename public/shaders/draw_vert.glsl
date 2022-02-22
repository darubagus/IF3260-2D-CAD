precision mediump float;

attribute vec2 verticePosition;
attribute vec3 verticeColor;
varying vec3 fragColor;

void main() {
  fragColor = verticeColor;
  gl_Position = vec4(verticePosition, 0.0, 1.0);
}