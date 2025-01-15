import Component from "./component.js";
import PhysicsBody from "./physicsBody.js";
import core from "../core.js";
import engine from "../engine.js";
import Renderer from "./renderer.js";
import { Vector2 } from "three";

export default class Lava extends Component {
  body = null;
  lambertianMat = null;
  toonMat = null;

  constructor() {
    super();
  }

  start() {
    this.body = this.gameObject.getComponent(PhysicsBody).body;
    this.lambertianMat = this.gameObject.getComponent(Renderer).lambertMaterial;
    this.toonMat = this.gameObject.getComponent(Renderer).toonMaterial;

    core.gamePlayManager.registerLava(this);
  }

  update() {
    this.lambertianMat.uniforms.lightIntensity.value = 2;
    this.lambertianMat.uniforms.textureOffset.value = new Vector2(
      core.time * 0.00005,
      0
    );

    this.toonMat.uniforms.lightIntensity.value = 2;
    this.toonMat.uniforms.textureOffset.value = new Vector2(
      core.time * 0.00005,
      0
    );
  }

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
        this.sphereExited(sphere);
      }
    });
  }

  sphereEntered(sphere) {
    engine.destroy(sphere.gameObject.id);
    core.audioManager.playSFX("sizzle");
  }

  sphereExited(sphere) {}
}
