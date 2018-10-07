// DepthBuffer.js
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable depth test
    gl.enable(gl.DEPTH_TEST);

    // Get the storage location of u_mvpMatrix
    var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    if (!u_mvpMatrix) {
        console.log('Failed to get the storage location of u_mvpMatrix');
        return;
    }

    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    // Calculate the view matrix and the projection matrix
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

    // Calculate the model view projection matrix
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    // Pass the model view projection matrix
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    // Prepare the model matrix for another pair of triangles
    modelMatrix.setTranslate(-0.75, 0, 0);

    // Calculate the model view projection matrix
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one 
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
    ]);
    var n = 9;
    
    var vertexColorbuffer = gl.createBuffer();
    if (!vertexColorbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Write vertex information to buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    
    return n;
}