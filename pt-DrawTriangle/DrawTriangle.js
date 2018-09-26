var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +      // Adding a vertex4 attribute in webGL 
    'void main(){\n' +                    // creating the function for the Vertex Shader
    '   gl_Position = a_Position;\n' +    // Assigning the position of the shader
    '}\n';                                // Ending the function

var FSHADER_SOURCE =
    'void main(){\n' +                                // creating the function for the Fragment Shader
    '   gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' + // Setting the Fragment Shader color to yellow with alpha of 1
    '}\n';                                            // Ending the function

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

    // initializing the vertex buffers, error log message, exit the program
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the position');
        return;
    }

    gl.clearColor(0, 0, 0, 1);                                      // Setting the clear color to black with an alpha of 1
    gl.clear(gl.COLOR_BUFFER_BIT);                                  // Clearing the screen

    gl.drawArrays(gl.TRIANGLES, 0, n);                              // Drawing the triangle to the screen

    //gl.drawArrays(gl.LINES, 0, n);                                  // Draws a line on the screen. (v0, v1) then ignores v2
    //gl.drawArrays(gl.LINE_STRIP, 0, n);                             // draws two lines on the screen (v0, v1) and (v1, v2).
    //gl.drawArrays(gl.LINE_LOOP, 0, n);                              // Draws two lines on the screen. (v0, v1) and (v1, v2) then connects (v0 and v2);

}

function initVertexBuffers(gl) {                                    // Initializing the vertices for the triangle.
    var vertices = new Float32Array([
        0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    var n = 3;                                                      // defines how many points to draw

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
    return n;                                                       // Return the number of vertices
}