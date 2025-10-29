// main.js
// Titik masuk aplikasi, mengelola state global, loop animasi, dan interaksi pengguna.

// Variabel Global
let gl;
let shaderProgram;
let cubeVertexBuffer, cubeIndexBuffer, cubeTexCoordBuffer, cubeNormalBuffer;
let texture;
let useTexture = true;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let nMatrix = mat3.create();
let lastTime = 0;
let currentAnimation = 'walk';
let animationFrame = 0;

const joints = {
    torsoY: 0, torsoX: 0,
    headY: 0, headZ: 0,
    tail1: 0, tail2: 0,
    fl_upper: 0, fl_lower: 0, 
    fr_upper: 0, fr_lower: 0,
    bl_upper: 0, bl_lower: 0,
    br_upper: 0, br_lower: 0,
};

// Fungsi Utama
function start() {
    const canvas = document.getElementById("glcanvas");
    gl = canvas.getContext('webgl');
    if (!gl) {
        alert("WebGL tidak didukung oleh browser Anda.");
        return;
    }
    setupShaders();
    setupBuffers();
    setupTexture();
    gl.clearColor(0.53, 0.81, 0.92, 1.0);
    gl.enable(gl.DEPTH_TEST);
    tick();
}

// Loop Animasi
function tick() {
    requestAnimationFrame(tick);
    drawScene();
    animate();
}

// Logika Animasi
function animate() {
    const timeNow = new Date().getTime();
    if (lastTime != 0) {
        animationFrame += (timeNow - lastTime) * 0.1;
    }
    lastTime = timeNow;

    const period = 100;
    const swing = Math.sin(animationFrame * Math.PI / period);
    const angle = 35 * swing;
    
    Object.keys(joints).forEach(k => joints[k] = 0);

    if (currentAnimation === 'walk') {
        joints.fl_upper = angle; joints.fl_lower = -Math.abs(angle);
        joints.br_upper = angle; joints.br_lower = -Math.abs(angle);
        joints.fr_upper = -angle; joints.fr_lower = -Math.abs(angle);
        joints.bl_upper = -angle; joints.bl_lower = -Math.abs(angle);
        joints.tail1 = 20 * swing; joints.tail2 = 10 * swing; joints.headY = 5 * swing;
    } 
    else if (currentAnimation === 'lieDown') {
        const progress = Math.min(animationFrame / 100, 1.0);
        const upperBend = -110 * progress;
        const lowerBend = 120 * progress;
        joints.fl_upper = upperBend; joints.fr_upper = upperBend;
        joints.bl_upper = upperBend; joints.br_upper = upperBend;
        joints.fl_lower = lowerBend; joints.fr_lower = lowerBend;
        joints.bl_lower = lowerBend; joints.br_lower = lowerBend;
        joints.torsoY = -1.3 * progress;
    }
    else if (currentAnimation === 'startled') {
        const duration = 50;
        const progress = Math.min(animationFrame / duration, 1.0);
        if (progress < 1.0) {
            joints.torsoY = 1.5 * Math.sin(progress * Math.PI);
            joints.tail1 = -90; joints.tail2 = 30;
        } else {
            setAnimation('walk');
        }
    }
}

// Fungsi Interaksi
function setAnimation(name) {
    currentAnimation = name;
    animationFrame = 0;
}

function toggleTexture(checked) {
    useTexture = checked;
}

// Titik Masuk Aplikasi
window.onload = start;