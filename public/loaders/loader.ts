/**
 * It returns shader source code from a file.
 * @param {string} source - glsl file path.
 * @return {shader} - shader source code.
 */
export async function fetchShader(source:string) {
  const shader = await fetch('/shaders/' + source).then((res) => res.text());
  return shader;
}

export const loadShader = async (
    gl:WebGL2RenderingContext,
    type: number,
    source: string) => {
  const rawShader = await fetchShader(source);
  const shader = gl.createShader(type);

  gl.shaderSource(shader, rawShader);
  gl.compileShader(shader);
};

export const createProgram =async (
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program!', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  };

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Error validating program!', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }

  return program;
};
