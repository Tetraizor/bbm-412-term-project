import Component from "./component.js";
import { runForSeconds } from "../utils/asyncUtils.js";
import { Vector3 } from "three";
import core from "../core.js";
import Renderer from "./renderer.js";
import PhysicsBody from "./physicsBody.js";
import GameObject from "../gameObject.js";
import ForceField from "./forceField.js";
import engine from "../engine.js";
import GamePlayManager from "./gameplayManager.js";

export default class Magnet extends Component {
  forceField = null;

  type = null;
  width = 1;
  height = 2;

  highlighting = false;

  constructor({ type, width = 1, height = 2 }) {
    super();

    this.type = type;
    this.width = width;
    this.height = height;
  }

  start() {
    // Make grow animation.
    this.gameObject.transform.scale.set(0.1, 0.1, 0.1);

    runForSeconds(0.4, (timeLeft) => {
      const elapsed = 0.4 - timeLeft;
      const elapsedNormal = elapsed / 0.4;

      let scale = 1;
      if (elapsedNormal < 0.7) {
        scale = (elapsedNormal * 1.1) / 0.7;
      } else {
        const progress = (elapsedNormal - 0.7) / 0.3;
        scale = 1.1 - progress * 0.1;
      }

      this.gameObject.transform.setScale(new Vector3(scale, scale, scale));
    });

    core.raycast.addListener(
      this.gameObject.getComponent(Renderer).mesh,
      (result) => {
        if (result.type === "enter") {
          this.gameObject.getComponent(Renderer).toggleOutline(true);
          this.highlighting = true;
        }

        if (result.type === "exit") {
          this.gameObject.getComponent(Renderer).toggleOutline(false);
          this.highlighting = false;
        }
      }
    );

    core.inputManager.addListener("mouseDown", (event) => {
      if (event.clickId !== 0) return;

      if (this.highlighting) {
        engine.destroy(this.gameObject.id);
      }
    });

    this.forceField = new GameObject(
      "ForceField",
      [
        new PhysicsBody({
          mass: 0,
          shape: {
            type: "box",
            width: this.height / 2,
            height: this.width / 2,
            depth: 0.3,
          },
          showGizmo: core.debugMode,
          collisionResponse: false,
        }),
        new ForceField({
          magnet: this,
          length: this.height,
          width: this.width,
          type: this.type,
        }),
      ],
      ["forceField"]
    );

    const forceFieldComponent = this.forceField.getComponent(ForceField);
    core.gamePlayManager.registerForceField(forceFieldComponent);

    this.forceField.transform.position.copy(this.gameObject.transform.position);
    this.forceField.transform.rotation.copy(this.gameObject.transform.rotation);

    engine.instantiate(this.forceField);
  }

  destroy() {
    core.gamePlayManager.unregisterForceField(
      this.forceField.getComponent(ForceField)
    );

    engine.destroy(this.forceField.id);
  }
}
