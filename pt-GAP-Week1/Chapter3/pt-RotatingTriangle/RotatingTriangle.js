// Rotating Triangle.js
// Vertex Shader Program

    // x' = x cos b - y sin b
    // y' = x sin b + y cos b
    // z' = z
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_CosB, u_SinB;\n' +
    'void main() {\n' +
    '  gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
    '  gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB; \n' +
    '  gl_Position.z - a_Position.z;\n' +
    '  gl_Position.w = 1.0;\n' +
    '}\n';

// Fragment Shader
var FSHADER_SOURCE =
    'void main(){\n' +                                // creating the function for the Fragment Shader
    '   gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' + // Setting the Fragment Shader color to yellow with alpha of 1
    '}\n';  

// Rotating angle
var ANGLE = 90.0;

function main() {
    var canvas = document.getElementById('webgl');    // Grabbing the canvas element from the HTML file

    var gl = getWebGLContext(canvas);                 // Rendering the canvas
    if (!gl) {                                        // error log for canvas initialization
        console.log('unable to get rendering context for web gl');  // the error message
        return;                                                     // exits the program
    }                                                               // Curly brace

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

    // Pass the data required to rotate

    var radian = Math.PI * ANGLE / 180.0; // Convert to radian
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
} // main()

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    var n = 3;

    var vertexBuffer = gl.createBuffer();                           // Creating buffer object + error message
    if (!vertexBuffer) {
        console.log('unable to create buffer object');
        return;

    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);       // Passing the vertices to the buffer object

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');// Getting the position of the triangle
    if (a_Position < 0) {
        console.log('failed to get source location');               // Error Message
        return;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);   // Drawing the triangle

    gl.enableVertexAttribArray(a_Position);
    return n;
}

