// PerspectiveView.js こんにちは、お元気ですか？　by the way, I know some Japanese! XD let me know if you see this
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
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

    gl.clearColor(0, 0, 0, 1);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }

    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    gl.clear(gl.COLOR_BUFFER_BIT);

    modelMatrix.setTranslate(0.75, 0, 0); // Translate 0.75 units
    // calculate the view matrix and projection matrix
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(45, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix); 
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    modelMatrix.setTranslate(-0.75, 0, 0); // Translate 0.75 units left
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix); 
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Three triangles on the right side
        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one 
        0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

        // Three triangles on the left side
        -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one 
        -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,

    ]);
    var n = 18; // Three vertices per triangle * 6

    var vertexColorbuffer = gl.createBuffer();
    if (!vertexColorbuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}