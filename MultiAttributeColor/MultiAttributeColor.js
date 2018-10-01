// MultiAttributeColor.js
// Vertex Shader Program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' + // Varying variable
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment Shader
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform float u_Width;\n' +
    'uniform float u_Height;\n' +
    'varying vec4 v_Color;\n' + 
    'void main() {\n' + 
    '   gl_FragColor = v_Color;\n' +
    '}\n';

function main() {

    var canvas = document.getElementById('webgl');

    // Retrieving canvas
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('unable to get rendering context for web gl');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('unable to load shaders');
        return;
    }

    // Set the positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the position');
        return;
    }

    // Set the color for the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //gl.drawArrays(gl.POINTS, 0, n); // For three, different colored points
    gl.drawArrays(gl.TRIANGLES, 0, n); // For one triangle that has a color gradient
} // main()

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);
    var n = 3;
    
    var vertexColorBuffer = gl.createBuffer();                           // Creating buffer object + error message
    if (!vertexColorBuffer) {
        console.log('unable to create color buffer object');
        return;

    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed to get source location');
        return;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);   // Drawing the triangle
    gl.enableVertexAttribArray(a_Color);
    return n;
}