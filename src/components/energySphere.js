import Component from "./component.js";
import Renderer from "./renderer.js";
import core from "../core.js";
import { Vector3 } from "three";
import PhysicsBody from "./physicsBody.js";

export default class EnergySphere extends Component {
  shell = null;
  physicsBody = null;

  constructor({ shell }) {
    super();

    this.shell = shell;
  }

  start() {
    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.shell.transform.setPosition(event.detail.position);
    });

    this.physicsBody = this.gameObject.getComponent(PhysicsBody);
    this.physicsBody.body.velocity.z = -0.5;
  }

  update() {
    const multiplier = (Math.sin((core.time * 4) / 1000) + 1) / 2;
    this.shell.transform.setScale(
      new Vector3(1, 1, 1).multiplyScalar(0.75 + multiplier * 0.15)
    );
  }
}
