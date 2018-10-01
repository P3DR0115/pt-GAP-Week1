// MultiAttributeSize.js
// Vertex Shader Program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

// Fragment Shader
var FSHADER_SOURCE =
    'void main() {\n' +                                // creating the function for the Fragment Shader
    '   gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' + // Setting the Fragment Shader color to yellow with alpha of 1
    '}\n';

function main() {

    var canvas = document.getElementById('webgl');    // Grabbing the canvas element from the HTML file

    // Retrieving canvas
    var gl = getWebGLContext(canvas);                 // Rendering the canvas
    if (!gl) {                                        // error log for canvas initialization
        console.log('unable to get rendering context for web gl');  // the error message
        return;                                                     // exits the program
    }                                                               // Curly brace

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {         // Initializing shaders with an inline function
        console.log('unable to load shaders');                      // Error log message
        return;                                                     // exits the program
    }                                                               // Curly brace

    // Set the positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the position');
        return;
    }

    // Set the color for the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.POINTS, 0, n);
} // main()

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;

    var sizes = new Float32Array([
        10.0, 20.0, 30.0
    ]);

    var vertexBuffer = gl.createBuffer();                           // Creating buffer object + error message
    if (!vertexBuffer) {
        console.log('unable to create buffer object');
        return;

    }
    var sizeBuffer = gl.createBuffer();                           // Creating buffer object + error message
    if (!sizeBuffer) {
        console.log('unable to create size buffer object');
        return;

    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);       // Passing the vertices to the buffer object
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');// Getting the position of the triangle
    if (a_Position < 0) {
        console.log('failed to get source location');               // Error Message
        return;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);   // Drawing the triangle
    gl.enableVertexAttribArray(a_PointSize);
    return n;
}