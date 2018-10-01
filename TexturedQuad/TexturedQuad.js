// Textured Quad
// Vertex Shader
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' + 
    'varying vec2 v_TexCoord;\n' + 
    'void main() {\n' + 
    '  gl_Position = a_Position;\n' + 
    '  v_TexCoord = a_TexCoord;\n' + 
    '}\n'; 

// Fragment Shader
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform float u_Width;\n' +
    'uniform float u_Height;\n' +
    'uniform sampler2D u_Sampler0;\n' + 
    'varying vec2 v_TexCoord;\n' + 
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler0, v_TexCoord);\n' + 
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('unable to get rendering context for web gl');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('unable to load shaders');
        return;
    }

    // initializing the vertex buffers, error log message, exit the program
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the position');
        return;
    }

    if (!initTextures(gl, n)) {
        console.log('failed to initialize textures');
        return;
    }

}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4; // The number of vertices

    // Create the buffer object
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('unable to create texture coordinate buffer object');
        return;
    }

    // Write the vertex coords and textures coords to the object buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed to get source location');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (!a_TexCoord) {
        console.log('failed to get a_TexCoord');
        return;
    }

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    var texture = gl.createTexture();

    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

    var image = new Image();

    image.onload = function () { loadTexture(gl, n, texture, u_Sampler0, image); };
    //image.src = 'C:\Users\P3dro\source\repos\GraphicsApp\pt-GAP-Week1\pt-GAP-Week1\TexturedQuad\library\rollSafe.png';
    image.src = '../library/rollSafe.png';

    return true;
}

function loadTexture(gl, n, texture, u_Sampler0, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler0, 0);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}