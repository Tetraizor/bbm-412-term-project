import Component from "../components/component.js";
import { Vector3 } from 'three';

export default class Ball extends Component {

    constructor() {
        super();
        this.velocity = new Vector3(0, 0, 0); // Initial velocity of the ball
        this.mass = 1; // Mass of the ball
        this.drag = 0.1; // Drag coefficient to slow down movement over time
    }

    update() {
        let totalForce = new Vector3(0, 0, 0); // The total magnetic force applied to the ball

        // Iterate through all magnets in the scene
        this.gameObject.scene.forEach(gameObject => {
            if (gameObject.name === 'Magnet') {
                const magnet = gameObject;
                const distance = this.transform.position.distanceTo(magnet.transform.position);
                const direction = magnet.transform.position.clone().sub(this.transform.position).normalize();

                // Calculate the force using the inverse square law (force decreases with the square of the distance)
                const force = (magnet.strength * this.mass) / Math.pow(distance, 2);

                // Apply the force to the ball
                totalForce.add(direction.multiplyScalar(force));
            }
        });

        // Update the ball's velocity based on the total magnetic force
        this.velocity.add(totalForce);

        // Apply drag to slow down the ball
        this.velocity.multiplyScalar(1 - this.drag);

        // Move the ball based on its velocity
        this.gameObject.transform.position.add(this.velocity);
    }
}
