import * as THREE from "three";
import Component from "./component.js";
import core from "../core.js";

export default class GizmoRenderer extends Component {
  mesh = null;

  length = 5;
  hexColor = 0xff0000;

  arrow = null;

  constructor(color = 0xff0000, length = 1) {
    super();
    this.color = color;
    this.length = length;
  }

  start() {
    super.start();

    this.arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      this.length,
      this.hexColor
    );

    core.scene.add(this.arrow);

    this.gameObject.transform.addListener("onPositionChanged", (event) => {
      this.arrow.position.set(
        event.detail.position.x,
        event.detail.position.y,
        event.detail.position.z
      );
    });

    this.gameObject.transform.addListener("onRotationChanged", (event) => {
      this.arrow.rotation.set(
        event.detail.rotation.x,
        event.detail.rotation.y,
        event.detail.rotation.z
      );
    });
  }

  update() {
    super.update();
  }

  destroy() {
    super.destroy();
  }
}
