let gl;
let shaderProgram;
let cubeVertexBuffer, cubeIndexBuffer, cubeTexCoordBuffer, cubeNormalBuffer;
let texture;
let useTexture = true;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let nMatrix = mat3.create();
let lastTime = 0;
let currentAnimation = "walk";
let animationFrame = 0;

let lightingSettings = {
  ambient: 0.3,
  dirX: -0.25,
  dirY: -0.25,
  spotCutoff: 25.0,
  spotExponent: 20.0,
};

// Variabel Kamera
let cameraRotationX = 0;
let cameraRotationY = 0;
let cameraDistance = 10;
let cameraPosition = [0, 0, cameraDistance];
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const joints = {
  torsoY: 0,
  torsoX: 0,
  headY: 0,
  headZ: 0,
  tail1: 0,
  tail2: 0,
  fl_upper: 0,
  fl_lower: 0,
  fr_upper: 0,
  fr_lower: 0,
  bl_upper: 0,
  bl_lower: 0,
  br_upper: 0,
  br_lower: 0,
};

// Fungsi Utama
function start() {
  const canvas = document.getElementById("glcanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL tidak didukung oleh browser Anda.");
    return;
  }
  setupShaders();
  setupBuffers();
  setupTexture();
  gl.clearColor(0.53, 0.81, 0.92, 1.0);
  gl.enable(gl.DEPTH_TEST);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("wheel", handleMouseWheel);
  document.addEventListener("keydown", handleKeyDown);

  updateLighting();

  tick();
}

// lighting
function updateLighting() {
  lightingSettings.ambient = document.getElementById("ambientIntensity").value;
  lightingSettings.dirX = document.getElementById("dirLightX").value;
  lightingSettings.dirY = document.getElementById("dirLightY").value;
  lightingSettings.spotCutoff = document.getElementById("spotCutoff").value;
  lightingSettings.spotExponent = document.getElementById("spotExponent").value;
}

// Loop Animasi
function tick() {
  requestAnimationFrame(tick);
  drawScene();
  animate();
}

function handleMouseDown(event) {
  isDragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp() {
  isDragging = false;
}

function handleMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  cameraRotationY -= deltaX * 0.01;
  cameraRotationX += deltaY * 0.01;

  cameraRotationX = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, cameraRotationX)
  );

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  updateCameraPosition();
}

function handleMouseWheel(event) {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  cameraDistance += delta * 0.5;

  cameraDistance = Math.max(3, Math.min(20, cameraDistance));
  updateCameraPosition();
}

function handleKeyDown(event) {
  const moveSpeed = 0.5;
  switch (event.key) {
    case "ArrowUp":
      cameraPosition[1] += moveSpeed;
      break;
    case "ArrowDown":
      cameraPosition[1] -= moveSpeed;
      break;
    case "ArrowLeft":
      cameraPosition[0] -= moveSpeed;
      break;
    case "ArrowRight":
      cameraPosition[0] += moveSpeed;
      break;
  }
}

function updateCameraPosition() {
  cameraPosition[0] =
    cameraDistance * Math.sin(cameraRotationY) * Math.cos(cameraRotationX);
  cameraPosition[1] = cameraDistance * Math.sin(cameraRotationX);
  cameraPosition[2] =
    cameraDistance * Math.cos(cameraRotationY) * Math.cos(cameraRotationX);
}

// Logika Animasi
function animate() {
  const timeNow = new Date().getTime();
  if (lastTime != 0) {
    animationFrame += (timeNow - lastTime) * 0.1;
  }
  lastTime = timeNow;

  const period = 100;
  const swing = Math.sin((animationFrame * Math.PI) / period);
  const angle = 35 * swing;

  Object.keys(joints).forEach((k) => (joints[k] = 0));

  if (currentAnimation === "walk") {
    joints.fl_upper = angle;
    joints.fl_lower = -Math.abs(angle);
    joints.br_upper = angle;
    joints.br_lower = -Math.abs(angle);
    joints.fr_upper = -angle;
    joints.fr_lower = -Math.abs(angle);
    joints.bl_upper = -angle;
    joints.bl_lower = -Math.abs(angle);
    joints.tail1 = 20 * swing;
    joints.tail2 = 10 * swing;
    joints.headY = 5 * swing;
  } else if (currentAnimation === "lieDown") {
    const progress = Math.min(animationFrame / 100, 1.0);
    const upperBend = -110 * progress;
    const lowerBend = 120 * progress;
    joints.fl_upper = upperBend;
    joints.fr_upper = upperBend;
    joints.bl_upper = upperBend;
    joints.br_upper = upperBend;
    joints.fl_lower = lowerBend;
    joints.fr_lower = lowerBend;
    joints.bl_lower = lowerBend;
    joints.br_lower = lowerBend;
    joints.torsoY = -1.3 * progress;
  } else if (currentAnimation === "startled") {
    const duration = 50;
    const progress = Math.min(animationFrame / duration, 1.0);
    if (progress < 1.0) {
      joints.torsoY = 1.5 * Math.sin(progress * Math.PI);
      joints.tail1 = -90;
      joints.tail2 = 30;
    } else {
      setAnimation("walk");
    }
  }
}

function setAnimation(name) {
  currentAnimation = name;
  animationFrame = 0;
}

function toggleTexture(checked) {
  useTexture = checked;
}

window.onload = start;
