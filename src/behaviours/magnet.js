import Component from "../components/component.js";
import * as THREE from 'three';
import MagneticField from "./magneticField.js";

export default class Magnet extends Component {

    constructor() {
        super();
        this.polarity = 1; // Default polarity
        this.strength = 1.0; // Default magnetic strength
    }

    start() {
        // Ensure the magnet is correctly initialized
        console.log(`Magnet initialized with polarity: ${this.polarity} and strength: ${this.strength}`);
        
        // Register the magnet in the MagneticField
        this.registerMagnet();
    }

    update() {
        // Optionally update behavior (like rotation, position changes, etc.)
        // For example, if the magnet moves, we might want to update the field
        const magnetPosition = this.gameObject.transform.position;
        console.log(`Magnet's position: ${magnetPosition.x}, ${magnetPosition.y}, ${magnetPosition.z}`);
        
        // Notify the MagneticField to update based on changes
        this.updateMagneticField();
    }

    // Register this magnet in the global MagneticField component
    registerMagnet() {
        const magneticField = this.gameObject.getComponent(MagneticField);  // Find the MagneticField component in the scene
        if (magneticField) {
            magneticField.magnets.push(this.gameObject);  // Add this magnet to the list of magnets
        } else {
            console.error('No MagneticField component found in the scene.');
        }
    }

    // Update the magnetic field when polarity or strength changes
    updateMagneticField() {
        const magneticField = this.gameObject.getComponent(MagneticField);
        if (magneticField) {
            magneticField.updateMagneticFieldLines();  // Update the magnetic field lines in the world
        } else {
            console.error('MagneticField component not found in the scene.');
        }
    }

    // Setter for polarity
    setPolarity(polarity) {
        this.polarity = polarity;
        this.updateMagneticField(); // Update field when polarity changes
    }

    // Setter for strength
    setStrength(strength) {
        this.strength = strength;
        this.updateMagneticField(); // Update field when strength changes
    }
}
