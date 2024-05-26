import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class Text {
    constructor() {
        // this.gentle;
        // this.studios;

        this.init();
    }

    init() {
        let gentleText = null;
        let studiosText = null;
        const fontLoader = new FontLoader();
        fontLoader.load('/fonts/cherry_bomb_one_regular.json', (font) => {
            gentleText = new TextGeometry('Gentle', {
                font,
                size: 0.5,
                height: 0.0, // the depth of the font
                // curveSegments: 5, // unsure what this does but we can tweak it later
                // bevelEnabled: true,
                // bevelThickness: 0.03,
                // bevelSize: 0.02, // uses different values from bevelThickness for demo purposes
                // bevelOffset: 0,
                // bevelSegments: 3,
            });
            studiosText = new TextGeometry('Studios', {
                font,
                size: 0.5,
                height: 0.0, // the depth of the font
                // curveSegments: 5, // unsure what this does but we can tweak it later
                // bevelEnabled: true,
                // bevelThickness: 0.03,
                // bevelSize: 0.02, // uses different values from bevelThickness for demo purposes
                // bevelOffset: 0,
                // bevelSegments: 3,
            });

            gentleText.center();
            studiosText.center();

            const textMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
            });

            const gentle = new THREE.Mesh(gentleText, textMaterial);
            const studios = new THREE.Mesh(studiosText, textMaterial);
            gentle.position.set(-0.1, 0.25, 0);
            studios.position.set(0.1, -0.25, 0);
            // gentle.position.set(-0.1, 0.25, 0);
            // studios.position.set(0.1, -0.25, 0);

            scene.add(gentle);
            scene.add(studios);
        });
    }
}
