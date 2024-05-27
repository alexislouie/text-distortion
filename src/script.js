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
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let screenCursor = new THREE.Vector2(9999, 9999);
window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / sizes.width) * 2 - 1;
    screenCursor.x = x;

    const y = -(event.clientY / sizes.height) * 2 + 1;
    screenCursor.y = y;
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
        // uScreenCursorPosition: new THREE.Uniform(new THREE.Vector2(9999, 9999)),
        // uDistortionTexture: new THREE.Uniform(distortion.texture),
        uColor: new THREE.Uniform(new THREE.Color('rgb(21, 26, 26)')),
    },
});

/**
 * Text
 */
let text = `Alta Haas\nGrotesk`;
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
    controls.update();

    const newIntersections = raycaster.intersectObject(textMesh);
    raycaster.setFromCamera(screenCursor, camera);
    // Get the UV coordinates of the mouse on the canvas (in pixel coordinates)
    if (newIntersections.length) {
        const uv = newIntersections[0].uv;
        material.uniforms.uRayCastUvCoordinates.value.set(uv.x, uv.y);
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
