import Component from "./component.js";
import PhysicsBody from "./physicsBody.js";
import core from "../core.js";
import { runForSeconds } from "../utils/asyncUtils.js";
import { Vector3 } from "three";

export default class Vacuum extends Component {
  body = null;

  constructor() {
    super();
  }

  start() {
    this.body = this.gameObject.getComponent(PhysicsBody).body;

    core.gamePlayManager.registerVacuum(this);
  }

  update() {}

  registerSphere(sphere) {
    const sphereBody = sphere.gameObject.getComponent(PhysicsBody).body;

    core.world.addEventListener("beginContact", (event) => {
      const { bodyA, bodyB } = event;

      if (
        (bodyA === sphereBody && bodyB === this.body) ||
        (bodyB === sphereBody && bodyA === this.body)
      ) {
        this.sphereEntered(sphere);
      }
    });

    core.world.addEventListener("endContact", (event) => {
      const { bodyA, bodyB } = event;

      if (
        (bodyA === sphereBody && bodyB === this.body) ||
        (bodyB === sphereBody && bodyA === this.body)
      ) {
        console.log("Sphere exited.");
      }
    });
  }

  sphereEntered(sphere) {
    const sphereBody = sphere.gameObject.getComponent(PhysicsBody).body;

    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;

    sphereBody.mass = 0;
    sphereBody.updateMassProperties();

    const directionTowardsVacuum = this.gameObject.transform.position
      .sub(new Vector3(0, -0.1, 0.6))
      .clone()
      .sub(sphere.gameObject.transform.position)
      .normalize();

    const length = this.gameObject.transform.position
      .clone()
      .sub(sphere.gameObject.transform.position)
      .length();

    const originalPosition = sphere.gameObject.transform.position.clone();

    core.audioManager.playSFX("vacuumIn");

    runForSeconds(1, (timeLeft) => {
      const elapsed = (1 - timeLeft) / 1;

      const interpolatedPosition = originalPosition
        .clone()
        .add(directionTowardsVacuum.clone().multiplyScalar(length * elapsed));

      sphere.gameObject.transform.setPosition(interpolatedPosition);
    });
  }
}
