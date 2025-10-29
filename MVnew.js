let mvMatrixStack = [];

function mvPushMatrix() {
  let copy = mat4.create();
  mat4.copy(copy, mvMatrix);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  mat3.fromMat4(nMatrix, mvMatrix);
  mat3.invert(nMatrix, nMatrix);
  mat3.transpose(nMatrix, nMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}
