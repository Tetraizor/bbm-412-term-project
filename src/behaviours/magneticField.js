import Component from "../components/component.js";
import { Vector3 } from "three";
import * as THREE from "three";

export default class MagneticField extends Component {
    constructor() {
        super();
        this.magnets = [];  // List of all magnet gameObjects
        this.fieldLines = [];  // Array to hold the magnetic field lines
    }

    start() {
        // Register magnets when the game starts
        this.registerMagnets();

        // Create the magnetic field lines based on the magnets in the world
        this.createMagneticFieldLines();
    }

    update() {
        // Continuously update the magnetic field and the lines
        this.updateMagneticFieldLines();
    }

    // Register all magnets in the scene
    registerMagnets() {
        // Get all objects with the tag "magnet"
        const magnets = this.gameObject.scene.filter(obj => obj.tags.includes("magnet"));
        this.magnets = magnets; // Store the magnets
    }

    // Create magnetic field lines from all magnets
    createMagneticFieldLines() {
        this.magnets.forEach(magnet => {
            const magnetPosition = magnet.transform.position;

            // Generate field lines based on the magnet position and polarity/strength
            const lineCount = 4;  // Number of field lines per magnet
            const angleStep = Math.PI / 2;  // Field lines angle step (for visualizing in 4 directions)

            // Loop through each line and generate field directions
            for (let i = 0; i < lineCount; i++) {
                const angle = i * angleStep;
                const direction = new Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();
                const length = magnet.getComponent('Magnet').strength * 5;  // Field strength determines the line length

                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(magnetPosition.clone());
                lineGeometry.vertices.push(magnetPosition.clone().add(direction.multiplyScalar(length)));

                const lineMaterial = new THREE.LineBasicMaterial({
                    color: magnet.getComponent('Magnet').polarity === 1 ? 0xFF0000 : 0x0000FF, // Red for positive, Blue for negative
                    opacity: 0.5,
                    transparent: true,
                });

                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.fieldLines.push(line);
                this.gameObject.scene.add(line);  // Add the line to the scene
            }
        });
    }

    // Update the magnetic field lines whenever a magnet moves or changes
    updateMagneticFieldLines() {
        this.fieldLines.forEach((line, index) => {
            const magnet = this.magnets[index];  // Get the magnet that corresponds to this line
            const magnetPosition = magnet.transform.position;
            const magnetComponent = magnet.getComponent('Magnet');
            const direction = new Vector3(Math.cos(index * Math.PI / 2), Math.sin(index * Math.PI / 2), 0).normalize();
            const length = magnetComponent.strength * 5;  // Field strength determines the length

            // Update line vertices
            line.geometry.vertices[1] = magnetPosition.clone().add(direction.multiplyScalar(length));
            line.geometry.verticesNeedUpdate = true; // Mark geometry as updated

            // Update line color based on the polarity
            line.material.color.setHex(magnetComponent.polarity === 1 ? 0xFF0000 : 0x0000FF);
        });
    }
}
