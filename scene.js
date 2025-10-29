// scene.js
// Mengelola semua aspek visual: setup shader, buffer, tekstur, dan logika penggambaran.

function setupShaders() {
    const vsSource = `attribute vec3 aVertexPosition; attribute vec3 aVertexNormal; attribute vec2 aTextureCoord; uniform mat4 uPMatrix; uniform mat4 uMVMatrix; uniform mat3 uNMatrix; uniform vec3 uAmbientColor; uniform vec3 uLightingDirection; uniform vec3 uDirectionalColor; varying vec2 vTextureCoord; varying vec3 vLightWeighting; void main(void) { gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); vTextureCoord = aTextureCoord; vec3 transformedNormal = uNMatrix * aVertexNormal; float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0); vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting; }`;
    const fsSource = `precision mediump float; varying vec2 vTextureCoord; varying vec3 vLightWeighting; uniform sampler2D uSampler; uniform bool uUseTexture; void main(void) { vec4 textureColor = texture2D(uSampler, vTextureCoord); vec4 color = uUseTexture ? textureColor : vec4(0.8, 0.5, 0.2, 1.0); gl_FragColor = vec4(color.rgb * vLightWeighting, color.a); }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vertexShader, vsSource); gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fragmentShader, fsSource); gl.compileShader(fragmentShader);
    shaderProgram = gl.createProgram(); gl.attachShader(shaderProgram, vertexShader); gl.attachShader(shaderProgram, fragmentShader); gl.linkProgram(shaderProgram); gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition"); gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal"); gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord"); gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix"); shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix"); shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix"); shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler"); shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "uUseTexture"); shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor"); shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection"); shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

function setupBuffers() {
    const vertices = [-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,1.0,1.0,-1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,-1.0,1.0,1.0,-1.0,1.0,1.0,1.0,1.0,-1.0,1.0,-1.0,-1.0,-1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,-1.0]; cubeVertexBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const textureCoordinates = [0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]; cubeTexCoordBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    const vertexNormals = [0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0]; cubeNormalBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    const cubeVertexIndices = [0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]; cubeIndexBuffer = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

function setupTexture() {
    texture = gl.createTexture(); const image = new Image(); image.crossOrigin = "anonymous";
    image.onload = function() { gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); gl.generateMipmap(gl.TEXTURE_2D); gl.bindTexture(gl.TEXTURE_2D, null); };
    image.src = "https://webglfundamentals.org/webgl/resources/mip-low-res-en.png"; 
}

function drawScene() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(pMatrix, degToRad(45), gl.canvas.width / gl.canvas.height, 0.1, 100.0);
    mat4.identity(mvMatrix); mat4.translate(mvMatrix, mvMatrix, [0.0, -2.0, -15.0]);
    gl.uniform1i(shaderProgram.useTextureUniform, useTexture); gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3);
    let lightingDirection = [-0.25, -0.25, -1.0]; let adjustedLD = vec3.create(); vec3.normalize(adjustedLD, lightingDirection); vec3.scale(adjustedLD, adjustedLD, -1); gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
    gl.uniform3f(shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);
    
    mvPushMatrix();
    
    mat4.translate(mvMatrix, mvMatrix, [0.0, joints.torsoY, 0.0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(joints.torsoX), [1, 0, 0]);

    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [2.0, 0.8, 1.0]); drawCube(); mvPopMatrix();
    mvPushMatrix(); mat4.translate(mvMatrix, mvMatrix, [2.5, 0.5, 0.0]); mat4.rotate(mvMatrix, mvMatrix, degToRad(joints.headY), [0, 1, 0]); mat4.rotate(mvMatrix, mvMatrix, degToRad(joints.headZ), [0, 0, 1]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.6, 0.6, 0.6]); drawCube(); mvPopMatrix();
    mvPushMatrix(); mat4.translate(mvMatrix, mvMatrix, [0.3, 0.6, 0.3]); mat4.scale(mvMatrix, mvMatrix, [0.1, 0.3, 0.1]); drawCube(); mvPopMatrix();
    mvPushMatrix(); mat4.translate(mvMatrix, mvMatrix, [0.3, 0.6, -0.3]); mat4.scale(mvMatrix, mvMatrix, [0.1, 0.3, 0.1]); drawCube(); mvPopMatrix();
    mvPopMatrix();
    mvPushMatrix(); mat4.translate(mvMatrix, mvMatrix, [-2.0, 0.5, 0.0]); mat4.rotate(mvMatrix, mvMatrix, degToRad(joints.tail1), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [-0.5, 0.0, 0.0]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.5, 0.15, 0.15]); drawCube(); mvPopMatrix();
    mat4.translate(mvMatrix, mvMatrix, [-0.5, 0.0, 0.0]); mat4.rotate(mvMatrix, mvMatrix, degToRad(joints.tail2), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [-0.5, 0.0, 0.0]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.5, 0.15, 0.15]); drawCube(); mvPopMatrix(); mvPopMatrix();
    
    drawLeg(1.5, -0.8, 0.8, joints.fl_upper, joints.fl_lower); 
    drawLeg(1.5, -0.8, -0.8, joints.fr_upper, joints.fr_lower);
    drawLeg(-1.5, -0.8, 0.8, joints.bl_upper, joints.bl_lower);
    drawLeg(-1.5, -0.8, -0.8, joints.br_upper, joints.br_lower);
    
    mvPopMatrix();
}

function drawLeg(x, y, z, upperAngleZ, lowerAngleZ) { 
    mvPushMatrix(); 
    mat4.translate(mvMatrix, mvMatrix, [x, y, z]); 
    mat4.rotate(mvMatrix, mvMatrix, degToRad(upperAngleZ), [0, 0, 1]); 
    mat4.translate(mvMatrix, mvMatrix, [0.0, -0.5, 0.0]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.2, 0.5, 0.2]); drawCube(); mvPopMatrix();
    mat4.translate(mvMatrix, mvMatrix, [0.0, -0.5, 0.0]); 
    mat4.rotate(mvMatrix, mvMatrix, degToRad(lowerAngleZ), [0, 0, 1]); 
    mat4.translate(mvMatrix, mvMatrix, [0.0, -0.5, 0.0]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.2, 0.5, 0.2]); drawCube(); mvPopMatrix();
    mat4.translate(mvMatrix, mvMatrix, [0.0, -0.5, 0.0]);
    mvPushMatrix(); mat4.scale(mvMatrix, mvMatrix, [0.25, 0.1, 0.25]); drawCube(); mvPopMatrix(); 
    mvPopMatrix();
}

function drawCube() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer); gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer); gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer); gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture); gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer); setMatrixUniforms(); gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}