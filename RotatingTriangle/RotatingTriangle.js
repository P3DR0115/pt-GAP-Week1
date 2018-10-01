// Continually Rotating Triangle.js
// Vertex Shader Program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment Shader
var FSHADER_SOURCE =
    'void main() {\n' +                                // creating the function for the Fragment Shader
    '   gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' + // Setting the Fragment Shader color to yellow with alpha of 1
    '}\n';

// Rotating angle
var ANGLE_STEP = 45.0;

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Get the storage location of u_ModelMatrix variable
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('unable to initialize the u_ModelMatrix');
        return;
    }
    
    var currentAngle = 0.0;
    // Matrix4 object
    var modelMatrix = new Matrix4();

    //Start to draw a new triangle
    var tick = function () {
        currentAngle = animate(currentAngle); // Update the rotation angle
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick); // Request that the browser calls tick
    };
    tick();

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

function draw(gl,n, currentAngle, modelMatrix, u_ModelMatrix) { 
    // Set up rotation matrix
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(0.75, 0, 0);

    // pass the rotation matrix to the vertex shader
    gl.uniformMatrix4fv( u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    //Draw triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

var g_last = Date.now();
function animate(angle) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last; // milliseconds
    g_last = now;

    // update the current rotation angle
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}