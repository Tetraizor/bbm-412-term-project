import Component from "./component.js";
import Renderer from "./renderer.js";
import core from "../core.js";
import { Vector3 } from "three";

export default class EnergySphere extends Component {
  shell = null;

  constructor({ shell }) {
    super();

    this.shell = shell;
  }

  start() {
    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.shell.transform.setPosition(event.detail.position);
    });
  }

  update() {
    const multiplier = (Math.sin((core.time * 4) / 1000) + 1) / 2;
    this.shell.transform.setScale(
      new Vector3(1, 1, 1).multiplyScalar(0.75 + multiplier * 0.15)
    );
  }
}
