import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import distortionVertexShader from './shaders/distortion/vertex.glsl';
import distortionFragmentShader from './shaders/distortion/fragment.glsl';

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc7cfbe);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Distortion Texture
 */
const distortion = {};
distortion.canvas = document.createElement('canvas');
distortion.canvas.width = 256;
distortion.canvas.height = 128;
distortion.canvas.style.position = 'fixed';
distortion.canvas.style.width = '512px';
distortion.canvas.style.height = '256px';
distortion.canvas.style.top = 0;
distortion.canvas.style.left = 0;
distortion.canvas.style.zIndex = 10;
distortion.context = distortion.canvas.getContext('2d');
document.body.append(distortion.canvas);

// Fill the canvas
distortion.context.fillRect(
    0,
    0,
    distortion.canvas.width,
    distortion.canvas.height
);

// Glow image
distortion.glowImage = new Image();
// distortion.glowImage.src = './glow.png';
distortion.glowImage.src = './glow-bigger.png';

// Interactive Plane
distortion.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.6),
    new THREE.MeshBasicMaterial({ color: 'goldenrod' })
);
// scene.add(distortion.interactivePlane);

// Raycaster
distortion.raycaster = new THREE.Raycaster();

distortion.screenCursor = new THREE.Vector2(9999, 9999);
distortion.canvasCursor = new THREE.Vector2(9999, 9999);
distortion.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

// Texture
distortion.texture = new THREE.CanvasTexture(distortion.canvas);

window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / sizes.width) * 2 - 1;
    distortion.screenCursor.x = x;

    const y = -(event.clientY / sizes.height) * 2 + 1;
    distortion.screenCursor.y = y;
});

/**
 * RAYCASTER
 */
const raycaster = new THREE.Raycaster();

/**
 * Materials
 */
const material = new THREE.ShaderMaterial({
    vertexShader: distortionVertexShader,
    fragmentShader: distortionFragmentShader,
    uniforms: {
        uRayCastUvCoordinates: new THREE.Uniform(new THREE.Vector2(9999, 9999)),
        uScreenCursorPosition: new THREE.Uniform(new THREE.Vector2(9999, 9999)),
        uDistortionTexture: new THREE.Uniform(distortion.texture),
        uColor: new THREE.Uniform(new THREE.Color('rgb(21, 26, 26)')),
    },
});

/**
 * Text
 */
let text = `Alta Haas\nGrotesk.`;
let textGeometry = null;
let textMesh = new THREE.Mesh();

const fontLoader = new FontLoader();
fontLoader.load('/fonts/AlteHaasGroteskBold.json', (font) => {
    textGeometry = new TextGeometry(text, {
        font,
        size: 0.5,
        depth: 0.0,
    });
    textGeometry.center();
    textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setClearColor('#181818');
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    // controls.update();

    // Set the raycaster
    if (textMesh) {
        const intersections = raycaster.intersectObject(textMesh);
        raycaster.setFromCamera(distortion.screenCursor, camera);

        // distortion.raycaster.setFromCamera(distortion.screenCursor, camera);

        // Find objects that raycaster intersects
        // const intersections = distortion.raycaster.intersectObject(
        //     distortion.interactivePlane
        // );

        // Get the UV coordinates of the mouse on the canvas (in pixel coordinates)
        if (intersections.length) {
            console.log('here!');
            const uv = intersections[0].uv;
            const x = uv.x * distortion.canvas.width;
            const y = (1 - uv.y) * distortion.canvas.height;
            distortion.canvasCursor.x = x;
            distortion.canvasCursor.y = y;

            material.uniforms.uRayCastUvCoordinates.value.set(uv.x, uv.y);
        }

        // Reset 2D canvas every render
        distortion.context.globalCompositeOperation = 'source-over';
        distortion.context.globalAlpha = 0.02;
        distortion.context.fillRect(
            0,
            0,
            distortion.canvas.width,
            distortion.canvas.height
        );

        // Find speed of the cursor
        const cursorDistance = distortion.canvasCursorPrevious.distanceTo(
            distortion.canvasCursor
        );
        distortion.canvasCursorPrevious.copy(distortion.canvasCursor);

        // Clamp it so max value is 1
        const alpha = Math.min(cursorDistance * 0.1, 1);

        const glowSize = distortion.canvas.width * 0.25;
        distortion.context.globalCompositeOperation = 'lighten';
        distortion.context.globalAlpha = alpha;
        distortion.context.drawImage(
            distortion.glowImage,
            distortion.canvasCursor.x - glowSize * 0.5,
            distortion.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize
        );

        // Update the screen cursor location uniform
        material.uniforms.uScreenCursorPosition.value.set(
            distortion.screenCursor.x,
            distortion.screenCursor.y
        );

        // Texture
        distortion.texture.needsUpdate = true;
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
